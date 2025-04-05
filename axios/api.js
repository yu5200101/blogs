// import axios from './axios'

const ContentTypeEnum  = {
  JSON: 'application/json;charset=UTF-8',
  TEXT: 'text/plain;charset=UTF-8',
  FORM_URLENCODED: 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA: 'multipart/form-data;charset=UTF-8'
}

const DEFAULT_TIMEOUT = 10 * 1000
class Api {
  constructor() {
    this.axiosInstance = axios.create({
      baseUrl: 'http://localhost:3000',
      timeout: DEFAULT_TIMEOUT,
      headers: {
        'content-type': ContentTypeEnum.FORM_URLENCODED
      },
      withCredentials: true,
      // 默认重试3次
      retry: 3,
      // 重试等待时间
      retryDelay: 1000,
      // 重试的条件
      retryCondition: (error) => {
        // 默认重试条件：超时或网络错误
        return (
          error.code === 'ECONNABORTED' ||
          !error.response ||
          (error.response.status >= 500 && error.response.status < 600)
        );
      },
      shouldResetTimeout: true,
    })
    // 请求计数器存储
    this.retryCounters = new Map()
    this.setHttpInterceptors()
  }
  getConfigKey(config) {
    return JSON.stringify({
      url: config.url,
      data: config.data,
      method: config.method
    })
  }
  setHttpInterceptors() {
    this.axiosInstance.interceptors.request.use(config => {
      const configKey = this.getConfigKey(config)
      // 初始化重试计数器
      if (!this.retryCounters.has(configKey)) {
        this.retryCounters.set(configKey, {
          count: 0,
          delay: config.retryDelay,
          lastAttempt: Date.now()
        });
      }
      if (config.data && config.data.cancelRequest) {
        const source = axios.CancelToken.prototype.source();
        config.data.cancelRequest.cancelToken = source.cancel
        config.cancelToken = source.token
      }
      if (config.data && config.data.cancelRequest) delete config.data.cancelRequest
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
      return config;
    }, error => {
      Promise.reject(error)
    });
    this.axiosInstance.interceptors.response.use(res => {
      // res包含config、data、headers、request、status、statusText
      const { status, data, config } = res
      const configKey = this.getConfigKey(config)
      // 请求成功时清除计数器
      this.retryCounters.delete(configKey);
      if (status >= 200 && status < 300) {
        return JSON.parse(data)
        // code===0直接返回,注意：成功编码正常值可以设置成变量但目前没必要
        // if (data.code === 0) return data
        // 忽略大于等于200小于300的错误码，当前只有oss使用
        if (config.ignoreErrorCode) return data
        // 上述场景都没有满足抛出异常
        // return Promise.reject(res)
      }
      return data
    }, async(error) => {
      const config = error.config;
      const configKey = this.getConfigKey(config)
      if (!config || !this.retryCounters.has(configKey)) {
        return Promise.reject(error);
      }

      const retryState = this.retryCounters.get(configKey);
      // 是否允许重试
      const shouldRetry =
        retryState.count < config.retry &&
        config.retryCondition(error);

      if (!shouldRetry) {
        this.retryCounters.delete(configKey);
        return Promise.reject(error);
      }

      // 计算下一次重试参数
      retryState.count += 1;
      retryState.delay *= 2; // 指数退避
      // 调整超时时间
      if (config.shouldResetTimeout) {
        config.timeout = Math.min(
          config.timeout * 1.5,
          config.timeout * 4 // 最大不超过初始超时的4倍
        );
      }
      // 等待重试延迟
      await new Promise(resolve =>
        setTimeout(resolve, retryState.delay)
      );
      retryState.lastAttempt = Date.now()
      return this.request(config);
    })
  }
  async request(config) {
    try {
      const res = await this.axiosInstance.request(config)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  }
  get(arg) {
    return this.request({
      method: 'get',
      ...arg
    })
  }
  JPost(arg) {
    return this.request({
      method: 'post',
      ...arg,
      headers: {
        'content-type': ContentTypeEnum.JSON,
        ...arg.headers
      }
    })
  }
  post(arg) {
    return this.request({
      method: 'post',
      ...arg
    })
  }
  FormPost(arg) {
    return this.request({
      method: 'post',
      ...arg,
      headers: {
        'content-type': ContentTypeEnum.FORM_DATA,
        ...headers
      }
    })
  }
}

const api = new Api()

console.log(api)