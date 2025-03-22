const refreshTextEle = document.getElementById('refreshText')
const refreshContainerEle = document.getElementById('refreshContainer')
let startPos = 0
let transitionHeight = 0

refreshContainerEle.addEventListener('touchstart', (e) => {
  startPos = e.touches[0].pageY
  refreshContainerEle.style.position = 'relative'
  refreshContainerEle.style.transition = 'transform 0s'
}, false)

refreshContainerEle.addEventListener('touchmove', (e) => {
  transitionHeight = e.touches[0].pageY - startPos

  if (transitionHeight > 0 && transitionHeight < 60) {
    refreshTextEle.innerText = '下拉刷新'
    refreshContainerEle.style.transform = `translateY(${transitionHeight}px)`

    if (transitionHeight > 55) {
      refreshTextEle.innerText = '释放更新'
    }
  }
}, false)

refreshContainerEle.addEventListener('touchend', () => {
  refreshTextEle.innerText = '刷新中...'
  refreshContainerEle.style.transition = 'transform 0.5s ease 1s'
  refreshContainerEle.style.transform = 'translateY(0px)'

  setTimeout(() => {
    refreshTextEle.innerText = 'refresh-text'
  }, 1000)
}, false)
