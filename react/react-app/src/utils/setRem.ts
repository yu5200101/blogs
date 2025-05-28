function setRem() {
  const docEl = document.documentElement
  const designWidth = 750 // 设计稿宽度
  const baseSize = 150   // 1rem = 100px（方便计算，如 750px 宽度下 1rem = 100px）

  const scale = docEl.clientWidth / designWidth
  docEl.style.fontSize = baseSize * Math.min(scale, 2) + 'px' // 限制最大缩放比例
}
// 初始化
setRem()
// 监听窗口变化
window.addEventListener('resize', setRem)
window.addEventListener('orientationchange', setRem)

export default setRem
