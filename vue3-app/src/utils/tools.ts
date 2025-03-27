import lodash from './lodash'
export const isTest = import.meta.env.MODE !== 'production'

export const promisify = (fun: Function, ...args: any[]) => new Promise((resolve, reject) => {
  fun.call(this, ...args, (err: any, result: any) => {
    if (err) reject(err)
    resolve(result)
  })
})

// 是否是wifi环境 默认非wifi
export const isWifi = () => {
  try {
    let wifi = false
    const ua = window.navigator.userAgent
    const con = window.navigator.connection || navigator.mozConnection || navigator.webkitConnection
    // 如果是微信
    if (/MicroMessenger/.test(ua) && ua.indexOf('WIFI') >= 0) {
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

export const QueryString = (item: string) => {
  const searchStr = window.location.search || lodash.get(window, 'cacheLocation.search') || ''
  const sValue = searchStr.match(new RegExp(`[?&]${item}=([^&]*)(&?)`, 'i'))
  return sValue ? sValue[1] : ''
}

export const objectToString = (object: object) => {
  try {
    return JSON.stringify(object)
  } catch (error) {
    return object.toString()
  }
}

export const sleepTime = (time: number) => new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      resolve(undefined)
    }, time * 1000)
  } catch (err) {
    reject(err)
  }
})

export const imgPath = (url:string) => {
  // 完整路径？
  if (url.includes('http')) {
    return url
  }

  return `${import.meta.env.VITE_CDN}${url}`
}


/**
 * 生成随机字符串，多少位由参数传入
 */
export const getRandomString = (length: number) => {
  const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  let str = ''
  for (let index = 0; index < length; index++) {
    const id = parseInt(String(Math.random() * 61))
    str += chars[id]
  }
  return str
}

export const kilobitStr = (str: string) => str.replace(/(?!^)(?=(\d{3})+$)/g, ',')

/*
 * @param {value} 需要加密的姓名
 * 两个字的显示最后一个字，
 * 其他显示第一个字和最后一个字
 * 名字里的分隔符也占一位
 */
export const encryptName = (value: string) => {
  if (!value) return ''
  if (value.length === 2) return value.split('').fill('*', 0, 1)
    .join('')
  return value.split('').fill('*', 1, value.length - 1)
    .join('')
}
/*
 * @param {value} 需要加密的姓名
 * 只加密第一个字
 * 名字里的分隔符也占一位
 */
export const encryptFirstName = (value: string) => {
  if (!value) return ''
  if (value.length === 1) return '*'
  return value.split('').fill('*', 0, 1)
    .join('')
}

/**
 * 显示前三位和最后四位
 */
export const encryptPhone = (value: string) => {
  if (!value) return ''
  return value.split('')
    .fill('*', 3, value.length - 4)
    .join('')
}

/**
 * 显示前三个数字和最后两个数字
 */
export const encryptIdCard = (value: string) => {
  if (!value) return ''
  return value.split('').fill('*', 3, value.length - 2)
    .join('')
}

// px需要带单位传 传入 '10px' 否则原样返回过去
export const px2rem = (px: string) => {
  if (!px.includes('px')) return px
  const size = px.slice(0, px.length - 2)
  return `${parseFloat(size) / 75}rem`
}

// 字符串转首字母小写驼峰格式
export const getHumpStr = (str: string) => {
  const re = /\/(\w)/g
  return str.replace(re, ($0, $1) => {
    return $1.toUpperCase()
  })
}


// 链接中除了第一个问号对其他问号进行删除
export const replaceQuestionMarks = (url: string) => {
  const questionMarksRegex = /\?/g

  // 找到第一个问号的位置
  const firstQuestionMarkIndex = url.indexOf('?')

  if (firstQuestionMarkIndex === -1) {
    // 如果没找到问号，则直接返回原始链接
    return url
  }

  // 对第一个问号之后的所有问号进行编码转义
  const replacedUrl = url.replace(questionMarksRegex, (match, offset) => {
    // 保留第一个问号，对其余问号进行编码转义
    if (offset > firstQuestionMarkIndex) {
      return ''
    }
    return match
  })

  return replacedUrl
}

// 补0方法
export const add0 = (num: number) => {
  return num >= 10 ? num : `0${num}`
}
