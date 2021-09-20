// JSON.parse的安全判断
const JSONParse = (objStr) => {
  try {
    return JSON.parse(objStr)
  } catch (err) {
    return null
  }
}

// 获取min 到max 的随机整数 不包含max
const getRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min

// base64 转文件对象
export const base64ToFile = (dataUrl, filename) => {
  // 获取到base64编码
  const arr = dataUrl.split(',')
  const type = arr[0].match(/:(.*?);/)[1]
  // 将base64编码转为字符串
  const bstr = window.atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n) // 创建初始化为0的，包含length个元素的无符号整型数组
  while (n--) {
    // 将字符串转成unicode码
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type
  })
}

// 使用canvas 把img元素 转成base64 并压缩
const drawBase64Image = (img, w = 500) => {
  let quality = 1
  const imgWidth = img.width
  const imgHeight = img.height
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  // 给width和height设置等比
  if (Math.max(imgWidth, imgHeight) > w) {
    if (imgWidth > imgHeight) {
      canvas.width = w
      canvas.height = w * imgHeight / imgWidth
    } else {
      canvas.height = w
      canvas.width = w * imgWidth / imgHeight
    }
  } else {
    canvas.width = imgWidth
    canvas.height = imgHeight
    quality = 1
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  let newBase64 = canvas.toDataURL('image/jpeg', quality)
  //压缩语句
  // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
  while (newBase64.length / 1024 > 150) {
    quality -= 0.01
    newBase64 = canvas.toDataURL('image/jpeg', quality)
  }
  // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
  while (newBase64.length / 1024 < 50) {
    quality += 0.001
    newBase64 = canvas.toDataURL('image/jpeg', quality)
  }
  return newBase64
}

// 远程图片url链接替换成base64编码
export const getBase64Image = (url, img) => {
  const image = new Image()
  // 支持跨域图片 先设置跨域 再赋值src
  image.crossOrigin = 'anonymous'
  // 处理缓存
  image.src = url + '?v=' + Math.random()
  image.addEventListener('load', () => {
    const base64 = drawBase64Image(image)
    img.src = base64
  }, false)
}

export default {
  JSONParse,
  getRandom,
  base64ToFile,
  drawBase64Image,
  getBase64Image
}
