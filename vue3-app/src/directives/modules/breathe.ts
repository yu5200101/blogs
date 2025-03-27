import lodash from '@/utils/lodash'

export default (app:any) => {
  app.directive('breathe', {
    mounted(el:any, binding:any) {
      const time = lodash.get(binding, 'value.time') || 1.2
      const rangeType = lodash.get(binding, 'value.scale') || 0.9
      try {
        el.animate([
          { transform: 'scale(1)' },
          { transform: `scale(${rangeType})` },
          { transform: 'scale(1)' }
        ], {
          duration: time * 1000,
          iterations: Infinity
        })
      } catch (error) {
        /**empty */
      }
    }
  })
}