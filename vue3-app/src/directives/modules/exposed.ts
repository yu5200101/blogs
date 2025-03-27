import { onUnmounted } from 'vue'
const THRESHOLDS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
export default (app:any) => {
  app.directive('exposed', {
    mounted(el:any, binding:any) {
      const { code, callback, exposure, hide, threshold = 0.5 } = binding.value
      // 记录是否已曝光
      let hasExpose = false
      const observer = new IntersectionObserver(entries => {
        const ratio = entries[0].intersectionRatio
        if (ratio > 0) {
          // 如果当前变化小于设置值，不上报;
          if (ratio < threshold || hasExpose) return
          // 入参埋点code，直接上报
          if (code) {
            console.log(code)
          }
          callback && callback(true)
          exposure && exposure()
          hasExpose = true
          if (binding.arg === 'once') {
            observer.disconnect()
          }
        } else if (ratio === 0) {
          callback && callback(false)
          hide && hide()
          hasExpose = false
        }
      }, { threshold: THRESHOLDS })
      observer.observe(el)
      onUnmounted(() => {
        observer.disconnect()
      })
    }
  })
}
