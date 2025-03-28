class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  use(fulfilled, rejected) {
    this.handlers.push({ fulfilled, rejected });
    return this.handlers.length - 1;
  }

  eject(id) {
    if (this.handlers[id]) this.handlers[id] = null;
  }

  forEach(fn) {
    this.handlers.forEach(handler => handler && fn(handler));
  }
}

class Axios {
  constructor(instanceConfig = {}) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };

    // 自动添加快捷方法
    ['get', 'post', 'put', 'delete'].forEach(method => {
      this[method] = (url, config) => this.request({
        ...config,
        url,
        method: method.toUpperCase()
      });
    });
  }

  create(options = {}) {
    return new Axios({
      ...this.defaults,
      ...options
    });
  }

  request(config) {
    const chain = [];
    let promise = Promise.resolve({ ...this.defaults, ...config });

    // 添加请求拦截器（倒序）
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    // 添加核心请求方法
    chain.push(this.dispatchRequest, undefined);

    // 添加响应拦截器（正序）
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }

  dispatchRequest(config) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const { url, method = 'GET', data, cancelToken } = config;

      // 请求取消逻辑
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          xhr.abort();
          reject(reason);
        });
      }

      xhr.open(method.toUpperCase(), url);
      xhr.onload = () => {
        resolve({
          data: xhr.response,
          status: xhr.status,
          statusText: xhr.statusText,
          headers: xhr.getAllResponseHeaders(),
          config,
          request: xhr
        });
      };

      xhr.onerror = () => reject(new Error('Network Error'));
      xhr.send(data);
    });
  }
}

// 单例模式实现
const axios = new Axios();

// 取消令牌实现
class CancelToken {
  constructor(executor) {
    let resolvePromise;
    this.promise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    executor(message => {
      resolvePromise({ message });
    });
  }

  static source() {
    let cancel;
    const token = new CancelToken(c => {
      cancel = c;
    });
    return { token, cancel };
  }
}

// 挂载取消令牌
axios.CancelToken = CancelToken;

export default axios;
