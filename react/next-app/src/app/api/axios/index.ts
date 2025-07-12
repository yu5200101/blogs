import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource
} from 'axios'

import cfg from '@/config/project'
import { setHttpInterceptors } from './httpInterceptors'

// content-type 常用的数据类型
export enum ContentTypeEnum {
  JSON = 'application/json;charset=UTF-8',
  TEXT = 'text/plain;charset=UTF-8',
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA = 'multipart/form-data;charset=UTF-8'
}

// 初始化 axiosOptions
const BASE_OPTIONS: AxiosRequestConfig = {
  baseURL: cfg.apiBaseURL,
  timeout: 10 * 1000,
  headers: {
    'content-type': ContentTypeEnum.FORM_URLENCODED
  },
  withCredentials: true,
  // 是否开启对 needBase64Keys 中的头部值进行 base64 编码，默认false
  enableBase64: true,
  // 需要做base64编码的头部字段名单，默认为空数组
  needBase64Keys: ['x-test'],
  // 是否开启请求头部设置 trace 相关字段，默认true
  enableTrace: true,
  // 在开启 trace 的基础上，设置采样开关：0为关闭;  1为开启
  traceSampler: 0,
  // 忽略大于等于200小于300的错误码，为oss使用
  ignoreErrorCode: false
}

class AxiosClass {
  // axios 实例
  private axiosInstance: AxiosInstance
  constructor(options: AxiosRequestConfig) {
    // 合并混入传参和默认参数
    const fusionOptions = { ...BASE_OPTIONS, ...options }
    // 创建实例
    this.axiosInstance = axios.create(fusionOptions)
    // 请求拦截器+返回拦截器
    setHttpInterceptors(this.axiosInstance, fusionOptions)
  }
  // 处理cancelToken
  private handlerCancelToken(config: AxiosRequestConfig) {
    // 注意：下述config的改变可以放在请求拦截器中，
    // 但是鉴于会对config内容进行破坏，放在拦截器前置处理
    // 处理cancelToken
    const source: CancelTokenSource = axios.CancelToken.source()
    // 给data对象的cancelRequest对象设置cancelToken方法
    if (config.data && config.data.cancelRequest) config.data.cancelRequest.cancelToken = source.cancel
    // 复制一份config并删除cancelRequest对象
    const copyConfig = {
      ...config,
      cancelToken: source.token
    }
    // 删除cancelRequest参数
    if (copyConfig.data) delete copyConfig.data.cancelRequest
    // 处理get请求替换参数
    if (copyConfig.method?.toLocaleLowerCase() === 'get' && copyConfig.data) {
      copyConfig.params = copyConfig.data
      delete copyConfig.data
    }
    return copyConfig
  }
  // 处理cancelToken、config配置
  private async request(config: AxiosRequestConfig) {
    const copyConfig = this.handlerCancelToken(config)
    try {
      const response: AxiosResponse = await this.axiosInstance(copyConfig)
      return response
    } catch (error) {
      return Promise.reject(error)
    }
  }
  // get
  public get(url: string, data?: any, timeout?: number, config?: AxiosRequestConfig) {
    return this.request({
      ...config,
      timeout,
      url,
      data,
      method: 'get'
    })
  }
  // JPost
  public JPost(url: string, data?: any, timeout?: number, config?: AxiosRequestConfig) {
    return this.request({
      ...config,
      timeout,
      url,
      data,
      method: 'post',
      headers: {
        'content-type': ContentTypeEnum.JSON
      }
    })
  }
  // post
  public post(url: string, data?: any, timeout?: number, config?: AxiosRequestConfig) {
    return this.request({
      ...config,
      timeout,
      url,
      data,
      method: 'post'
    })
  }
  // OSS
  public OSS(url: string, data?: any, timeout?: number, config?: AxiosRequestConfig) {
    return this.request({
      ...config,
      timeout,
      baseURL: '//store.test.com',
      url,
      withCredentials: false,
      data: {
        ...data,
        _t: new Date().getTime()
      },
      ignoreErrorCode: true,
      method: 'get',
      headers: {
        'content-type': ContentTypeEnum.JSON
      }
    })
  }
}

// 这里可以自定义一些默认该项目的参数，如果需要再下面导出其他的默认配置
export default new AxiosClass({})
