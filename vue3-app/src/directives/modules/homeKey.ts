// 兼容HOME键展示
export default (app:any) => {
  app.directive('homekey', {
    mounted(el:any, binding:any) {
      const defaultRange = 20
      let currentRange = 0
      const rangeType = binding.expression || 'paddingBottom'

      try {
        currentRange = parseInt(window.getComputedStyle(el)[rangeType], 10) || 0
      } catch (err) {
        /**empty */
      }

      if (el.style[rangeType] === undefined) return

      el.style[rangeType] = `${currentRange + defaultRange}px`
    }
  })
}