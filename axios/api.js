// import axios from './axios'

const ContentTypeEnum  = {
  JSON: 'application/json;charset=UTF-8',
  TEXT: 'text/plain;charset=UTF-8',
  FORM_URLENCODED: 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA: 'multipart/form-data;charset=UTF-8'
}

class Api {
  constructor() {
    this.axiosInstance = axios.create({
      baseUrl: 'http://localhost:3000',
      timeout: 10 * 1000,
      headers: {
        'content-type': ContentTypeEnum.FORM_URLENCODED
      },
      withCredentials: true
    })
    this.setHttpInterceptors()
  }
  setHttpInterceptors() {
    this.axiosInstance.interceptors.request.use(config => {
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
    }, error => {
      Promise.reject(error)
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
  get({ url, data, timeout, headers}) {
    return this.request({
      url,
      data,
      timeout,
      method: 'get'
    })
  }
  JPost({ url, data, timeout, headers}) {
    return this.request({
      url,
      data,
      timeout,
      method: 'post',
      headers: {
        'content-type': ContentTypeEnum.JSON
      }
    })
  }
  post({ url, data, timeout, headers}) {
    return this.request({
      url,
      data,
      timeout,
      method: 'post'
    })
  }
}

const api = new Api()