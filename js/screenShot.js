/**
 * @author       yuruyuan
 * @date         2021-06-23 15:05:15
 * @description  使用html2canvas截图
 */
import {
  base64ToFile,
  getBase64Image
} from './common'
import html2canvas from 'html2canvas'

const screenShot = (html, name) => {
  return new Promise((resolve, reject) => {
    const box = document.createElement('div')
    box.style.position = 'fixed'
    box.style.right = '-200vw'
    box.style.top = '-200vh'
    box.innerHTML = html
    window.pageYOffset = 0
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    document.body.appendChild(box)
    const imgLists = box.getElementsByTagName('img')
    imgLists && Array.from(imgLists).forEach((img) => {
      img.width = '100'
      // 两种方式都需要图片url和使用的页面的origin能跨域访问
      // 1.将图片转成base64 可以截图 chrome safari都支持
      getBase64Image(img.src, img)
      // 2.加上crossOrigin="anonymous" 可以截图 但是此种方式只适用于chrome safari不支持
      // img.crossOrigin = 'anonymous'
    })
    setTimeout(() => {
      html2canvas(box, {
        width: box.clientWidth,
        height: box.clientHeight,
        // 【重要】开启跨域配置
        useCORS: true
      }).then((canvas) => {
        const imgUrl = canvas.toDataURL('image/jpeg')
        const size = imgUrl.length / 1024
        console.log(size, '截图后的长度')
        const time = new Date().getTime()
        const file = base64ToFile(imgUrl, `${name}-${time}.jpeg`)
        const fileForm = new FormData()
        fileForm.append('file', file)
        fileForm.append('size', size)
        document.body.removeChild(box)
        resolve(fileForm)
      }).catch((err) => {
        reject(err)
      })
    // 设置时间防止图片未加载完全截图
    }, 5000)
  })
}

export default screenShot
