import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    // 是否开启对 needBase64Keys 中的头部值进行 base64 编码，默认false
    enableBase64?: boolean,
    // 需要做base64编码的头部字段名单，默认为空数组
    needBase64Keys?: string[],
    // 是否开启请求头部设置 trace 相关字段，默认true
    enableTrace?: boolean,
    // 在开启 trace 的基础上，设置采样开关：0为关闭;  1为开启
    traceSampler?: number,
    // 忽略大于等于200小于300的错误码，为oss使用
    ignoreErrorCode?: boolean,
    // 取消请求
    cancelRequest?: any
  }
}
