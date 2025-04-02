let imgList = document.getElementsByTagName('img')
let num = imgList.length
let count = 0

// 方案一：使用offsetTop scrollTop clientHeight实现
// function lazyLoad () {
//   const viewHeight = document.documentElement.clientHeight
//   const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
//   Array.from(imgList).forEach(img => {
//     if (img.offsetTop < viewHeight + scrollTop) {
//       if (img.getAttribute('src')) return
//       img.src = img.getAttribute('data-src')
//       count += 1
//     }
//   })
// }

// 方案二：使用getBoundingClientRect,判断出现在了当前视口

// function lazyLoad() {
//   const viewHeight = document.documentElement.clientHeight
//   Array.from(imgList).forEach(img => {
//     if (img.getBoundingClientRect().top < viewHeight) {
//       if (img.getAttribute('src')) return
//       img.src = img.getAttribute('data-src')
//       count += 1
//     }
//   })
// }
// window.onscroll = throttle(lazyLoad, 200)

// 方案三：使用IntersectionObserver
const observeObj = new IntersectionObserver(changes => {
  changes.forEach(change => {
    if (change.isIntersecting) {
      const img = change.target
      if (img.getAttribute('src')) return
      img.src = img.getAttribute('data-src')
      observeObj.unobserve(img)
    }
  })
})
Array.from(imgList).forEach((img) => {
  observeObj.observe(img)
})