import storage from '@/utils/storage'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios'
import { interceptCode } from './interceptCode'
import { stringToBase64, random64Hex } from './util'

// token常量
enum TokenEnum {
  TOKEN_KEY = 'authorizationv2',
  COOKIE_TOKEN_KEY = 'token'
}
// 部分header key值常量
enum HeadersKeys {
  TEST_KEY = 'test-key'
}

// 插入拦截器
export const setHttpInterceptors = (axiosInstance: AxiosInstance, options: AxiosRequestConfig) => {
  // 设置请求拦截--只处理option配置先关对config的改变
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 通过 withCredentials配置管理
      if (options.withCredentials) {
        config.headers[TokenEnum.TOKEN_KEY] = storage.cookie.getItem(TokenEnum.COOKIE_TOKEN_KEY)
      }
      // 支持配置添加
      if (options.enableTrace) {
        const uniqueId = random64Hex()
        config.headers[HeadersKeys.TEST_KEY] = uniqueId
      }
      // 需要做base64编码的头部字段名单，并进行编码
      if (options.enableBase64 && options.needBase64Keys && options.needBase64Keys.length) {
        options.needBase64Keys.forEach((key: string) => {
          const value = config.headers[key]
          if (value) config.headers[key] = stringToBase64(value)
        })
      }
      config.headers.uuid = storage.cookie.getItem('uuid')
      return config
    },
    (error: AxiosError) =>
      // console.log('axios请求拦截器Error', error)
      Promise.reject(error)
  )
  // 设置响应拦截
  axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => {
      // res包含config、data、headers、request、status、statusText
      const { status, data, config } = res
      if (status >= 200 && status < 300) {
        // code===0直接返回,注意：成功编码正常值可以设置成变量但目前没必要
        if (data.code === 0) return data
        // 忽略大于等于200小于300的错误码，当前只有oss使用
        if (config.ignoreErrorCode) return data
        // 异常业务码(处理自定义的错误码：账号相关问题)
        if (!interceptCode(res)) return Promise.reject(data)
        // 上述场景都没有满足抛出异常
        return Promise.reject(res)
      }
      // TODO:status的状态错误是否增加一定的统一错误处理
      return data
    },
    (error: AxiosError) => {
      // console.log('axios请求拦截器Error', error)
      return Promise.reject(error)
    }
  )
}