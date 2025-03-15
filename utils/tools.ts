export const waitTime = (time: number) => new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      resolve(undefined)
    }, time * 1000)
  } catch (err) {
    reject(err)
  }
})

export const kilobitStr = (str: string) => str.replace(/(?!^)(?=(\d{3})+$)/g, ',')


// 是否是wifi环境 默认非wifi
export const isWifi = () => {
  try {
    let wifi = false
    const userAgent = window.navigator.userAgent
    const con = window.navigator.connection || navigator.mozConnection || navigator.webkitConnection
    // 如果是微信
    if (/MicroMessenger/.test(userAgent) && userAgent.indexOf('WIFI') >= 0) {
      wifi = true
    // 如果支持navigator.connection
    } else if (con) {
      const network = con.type
      if (network === 'wifi' || network === '2') {
        wifi = true
      }
    }
    return wifi
  } catch (error) {
    return false
  }
}

// px需要带单位传 传入 '10px' 否则原样返回过去
export const pxToRem = (px: string) => {
  if (!px.includes('px')) return px
  const size = px.slice(0, px.length - 2)
  return `${parseFloat(size) / 75}rem`
}


export const getQueryValueByKey = (item: string) => {
  const allSearchStr = window.location.search || lodash.get(window, 'cacheLocation.search') || ''
  const sValue = allSearchStr.match(new RegExp(`[?&]${item}=([^&]*)(&?)`, 'i'))
  return sValue ? sValue[1] : ''
}