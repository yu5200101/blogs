const getUa = (targetUa?: string) => {
  let ua = targetUa || ''

  if (!ua && typeof window !== 'undefined') {
    ua = window.navigator.userAgent.toLocaleLowerCase()
  }

  return ua
}

// ua中包含目标元素
const uaIncludeTarget = (target: string[], targetUa?: string):boolean => {
  const ua = getUa(targetUa)

  for (let it = 0; it < target.length; it++) {
    if (!ua.includes(target[it])) {
      return false
    }
  }

  return true
}

// 是否是微信，纯微信H5，不包括微信小程序
export const isWxH5 = () => {
  // 非微信环境
  if (!uaIncludeTarget(['micromessenger'])) {
    return false
  }

  // 不是企信环境
  if (uaIncludeTarget(['wxwork'])) {
    return false
  }

  const wxEnvironment = window.__wxjs_environment || ''

  // 不是小程序
  if (wxEnvironment === 'miniprogram') {
    return false
  }

  return true
}

// 是否是ios手机
export const isIOS = () => uaIncludeTarget(['iphone os'])

// 是否是安卓手机
export const isAndroid = () => uaIncludeTarget(['android'])

// 是否是鸿蒙系统手机
export const isHarmony = () => uaIncludeTarget(['openharmony', 'arkweb'])

// 判断是否是快手小程序内
export const isKuaishouMiniprogram = () => {
  // 快手开发者工具
  if (uaIncludeTarget(['kmasimulator'])) return true
  return uaIncludeTarget(['kuaishou', 'miniprogram'])
}

// 是否是小程序
export const isMiniprogram = () => {
  // 排除快手小程序
  if (isKuaishouMiniprogram()) return false
  return uaIncludeTarget(['miniprogram']) || window.__wxjs_environment === 'miniprogram'
}

// 判断是否在支付宝客户端内
export const isAlipay = () => uaIncludeTarget(['alipayclient'])

// 判断是否是快手小程序内
export const isDouYinApp = () => uaIncludeTarget(['aweme'])

// 是头条小程序
export const isTTMiniprogram = () => uaIncludeTarget(['toutiaomicroapp'])

// 判断是否是头条app环境
export const isTouTiaoApp = () => uaIncludeTarget(['newsarticle'])

export const isChrome = () => {
  const ua = getUa()
  return ua.includes('chrome')
}

// 判断移动端或PC
export const isPC = () => {
  const ua = getUa()
  const agents = ['android', 'iphone', 'symbianos', 'windows phone', 'ipad', 'ipod']

  return agents.every(item => ua.indexOf(item) === -1)
}

// 通过ua获取app DeviceCode
export const getDeviceCode = () => {
  try {
    const ua = getUa()
    const reg = /test-app-(.*)-#/g
    const appMes = ua.match(reg)

    if (!appMes || appMes.length < 0) {
      return ''
    }
    const jsonUid = appMes[0].replace('test-app-', '').replace('-#', '')
    const { deviceid } = JSON.parse(jsonUid)
    return deviceid
  } catch (err) {
    return ''
  }
}

const compareVs = (v1: string, v2: string) => {
  const v1Split = v1.split('.')
  const v2Split = v2.split('.')
  const len = Math.min(v1Split.length, v2Split.length)
  let result = false
  let curIndex = 0
  while (curIndex < len && !result) {
    result = +v1Split[curIndex] > +v2Split[curIndex]
    curIndex += 1
  }
  return result
}

export const isUseWxOpenTags = () => {
  try {
    const ua = getUa()
    const testUa = (regexp: RegExp) => regexp.test(ua)
    const testVs = (regexp: RegExp) => ua && ua.match(regexp).toString()
      .replace(/[^0-9|_.]/g, '')
      .replace(/_/g, '.')
    const shellWxVsLowest = '7.0.12'
    const isWx = testUa(/micromessenger/g)

    if (isWx) {
      return compareVs(testVs(/micromessenger\/[\d._]+/g), shellWxVsLowest)
    }
    return false
  } catch (err) {
    return false
  }
}