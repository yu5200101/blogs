import { isWxH5, isMiniprogram } from '@/app/utils/platform'
import type { AxiosResponse } from 'axios'

const showLogin = () => {
  console.log('展示登录弹窗')
}
const account = {
  interceptHttpCode(code: number): void {
    console.log(`报错:${code}`)
  }
}
// 显示错误逻辑
const showError = (response: AxiosResponse) => {
  console.log('showError')

  return false
}

// 显示登录
const showLoginHandle = (response: AxiosResponse) => {
  const isWxOrMini = isWxH5() || isMiniprogram()
  if (!isWxOrMini) {
    showLogin()
    return false
  }

  account.interceptHttpCode(response.data.code)
  return false
}

// 刷新token
const refreshToken = (response: AxiosResponse) => {
  account.interceptHttpCode(response.data.code)

  return false
}

const interceptMap = new Map()

// 未绑
interceptMap.set(1, () => {
  showLogin()
  return false
})
interceptMap.set(2, showError)
interceptMap.set(3, refreshToken)
interceptMap.set(4, showLoginHandle)

export const interceptCode = (response: AxiosResponse) => {
  const code = +response.data.code

  if (interceptMap.has(code)) {
    return interceptMap.get(code)(response)
  }
  // 以上都不满足，默认需要Promise.reject处理
  return true
}
