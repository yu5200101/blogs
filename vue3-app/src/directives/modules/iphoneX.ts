
/**
 * @describe  iphoneX系列机型适配
 * @example
 * <div v-iphonex-v2></div>  增加padding-bottom 34px
 * <div v-iphonex-v2="'top'"></div> 增加top 34px
 * <div v-iphonex-v2="'bottom'"></div> 增加buttom 34px
 */

interface XSeriesConfig {
  devicePixelRatio: number
  width: number
  height: number
}
const isIphonex = () => {
  // X XS, XS Max, XR
  const xSeriesConfig: XSeriesConfig[] = [
    {
      devicePixelRatio: 3,
      width: 375,
      height: 812
    },
    {
      devicePixelRatio: 3,
      width: 414,
      height: 896
    },
    {
      devicePixelRatio: 2,
      width: 414,
      height: 896
    }
  ]

  if (typeof window !== 'undefined' && window) {
    const isIOS = /iphone/gi.test(window.navigator.userAgent)
    if (!isIOS) return false
    const { devicePixelRatio, screen } = window
    const { width, height } = screen
    return xSeriesConfig.some(
      item =>
        item.devicePixelRatio === devicePixelRatio &&
        item.width === width &&
        item.height === height
    )
  }

  return false
}
export default (app:any) => {
  app.directive('iphoneX', {
    mounted(el:any, binding:any) {
      let currentRange = 0
      const defaultRange = 34
      const rangeType = binding.value || 'padding-bottom'

      if (!isIphonex()) return

      try {
        currentRange = parseInt(
        window.getComputedStyle(el)[rangeType] as string,
        10
        )
        if (isNaN(currentRange)) currentRange = 0
      } catch (error) {
        return
      }

      if (!(rangeType in el.style)) return

      el.style[rangeType] = `${currentRange + defaultRange}px`
    }
  })
}