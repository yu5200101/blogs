import lodash from '@/utils/lodash'
import { px2rem } from '@/utils/tools'

const setStyle = (el: any, style: {[key: string]: any}) => {
  try {
    Object.keys(style).forEach((key: string) => {
      el.style[key] = style[key]
    })
  } catch (error) {
    // empty
  }
}
export default (app:any) => {
  app.directive('triangle', {
    mounted(el:any, binding:any) {
      // 颜色必传，否则不展示
      const backgroundColor = lodash.get(binding, 'value.backgroundColor') || 'transparent'
      // 可以传10% 也可以传20px
      const left = lodash.get(binding, 'value.left') || '30%'
      // size，可按设计图尺寸传px
      const size = lodash.get(binding, 'value.size')
      const position = lodash.get(binding, 'value.position') || 'bottom'
      const type = lodash.get(binding, 'value.type') || ''
      const borderRadius = lodash.get(binding, 'value.borderRadius') || ''
      try {
        const boxStyle = {}
        const currentStyle = window.getComputedStyle(el)
        if (!currentStyle.position) {
          el.style.position = 'relative'
        }
        setStyle(el, boxStyle)
        const contentStyle = {
          content: '',
          width: size ? px2rem(size) : '20px',
          height: size ? px2rem(size) : '20px',
          borderRadius: `0 0 ${borderRadius ? px2rem(borderRadius) : '6px'}`,
          transform: 'rotate(45deg) translateY(30%)',
          transformOrigin: '0 0',
          position: 'absolute',
          bottom: 0,
          left: left ? px2rem(left) : '30%',
          clipPath: 'polygon(50% 50%, 100% 0%, 100% 100%, 0% 100%)',
          border: `${px2rem('1px')} solid transparent`,
          backgroundColor
        }
        const triangleDom = document.createElement('i')
        // 向上箭头，特殊处理样式
        if (position === 'top') {
          const bottom = lodash.get(binding, 'value.bottom')
          const top = lodash.get(binding, 'value.top')
          Object.assign(contentStyle, {
            bottom: bottom ? px2rem(bottom) : 'auto',
            top: top ? px2rem(top) : 0,
            clipPath: 'polygon(0% 0%, 100% 0%, 50% 50%, 0% 100%)',
            borderRadius: `${borderRadius ? px2rem(borderRadius) : '6px'} 0 0`,
            transform: 'rotate(45deg) translateY(-90%)'
          })
        }

        if (type === 'border') {
          const borderColor = lodash.get(binding, 'value.borderColor') || 'transparent'
          Object.assign(contentStyle, {
            borderColor
          })
        }
        setStyle(triangleDom, contentStyle)
        el.appendChild(triangleDom)
      } catch (error) {
        /**empty */
      }
    }
  })
}
