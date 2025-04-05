class FrontendMonitor {
  static instance = null;
  config = {
    reportUrl: 'http://localhost:3000/api/send-error',
    vue: null,
    extraData: {}
  };

  constructor(config) {
    Object.assign(this.config, config)
    this.init();
  }

  static getInstance(config) {
    if (!this.instance) {
      this.instance = new FrontendMonitor(config);
    }
    return this.instance;
  }

  init() {
    // 初始化Vue错误监听
    if (this.config.vue) {
      this.catchVueError();
    }

    // 捕获全局错误
    window.addEventListener('error', this.handleWindowError.bind(this));

    // 捕获未处理的Promise拒绝
    window.addEventListener('unhandledrejection', this.handlePromiseError.bind(this));

    // 拦截XMLHttpRequest
    this.interceptXHR();

    // 拦截Fetch请求
    this.interceptFetch();
  }

  // Vue错误捕获
  catchVueError() {
    this.config.vue.config.errorHandler = (err, vm, info) => {
      this.reportError({
        type: 'VueError',
        message: err.message,
        component: vm.$options.name,
        stack: err.stack,
        info: info
      });
    };
  }

  // 窗口错误处理
  handleWindowError(event) {
    const { message, filename, lineno, colno, error } = event;
    this.reportError({
      type: 'GlobalError',
      message,
      filename,
      lineno,
      colno,
      stack: error?.stack
    });
  }

  // Promise错误处理
  handlePromiseError(event) {
    const reason = event.reason;
    this.reportError({
      type: 'PromiseError',
      message: reason.message,
      stack: reason.stack
    });
  }

  // 拦截XMLHttpRequest
  interceptXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
      this._method = method;
      this._url = url;
      return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
      this.addEventListener('loadend', () => {
        if (this.status >= 400) {
          FrontendMonitor.getInstance().reportError({
            type: 'XHRError',
            method: this._method,
            url: this._url,
            status: this.status,
            response: this.response
          });
        }
      });

      return originalSend.apply(this, arguments);
    };
  }

  // 拦截Fetch请求
  interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = Date.now();
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          this.reportError({
            type: 'FetchError',
            url: response.url,
            status: response.status,
            duration: Date.now() - startTime
          });
        }
        return response;
      } catch (error) {
        this.reportError({
          type: 'FetchError',
          url: args[0],
          message: error.message,
          duration: Date.now() - startTime
        });
        throw error;
      }
    };
  }

  // 错误上报
  reportError(errorInfo) {
    const reportData = {
      extraData: this.config.extraData,
      ...errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // 使用navigator.sendBeacon上报，必须是post请求
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(reportData)], {
        type: 'application/json; charset=UTF-8'
      });
      navigator.sendBeacon(this.config.reportUrl, blob);
    } else {
      // 回退到XMLHttpRequest
      const xhr = new XMLHttpRequest();
      xhr.open('POST', this.config.reportUrl);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(reportData));
    }

    console.error('Captured error:', reportData);
  }

  // 设置配置
  setConfig(config) {
    this.config = { ...this.config, ...config };
    if (config.vue) {
      this.catchVueError();
    }
  }

  // 添加额外数据
  addExtraData(data) {
    this.config.extraData = { ...this.config.extraData, ...data };
  }
}

// 使用方法
const monitor = FrontendMonitor.getInstance({
  vue: Vue // 传入Vue实例
});

// 添加额外上下文信息
monitor.addExtraData({
  appVersion: '1.0.0',
  userId: '12345'
});