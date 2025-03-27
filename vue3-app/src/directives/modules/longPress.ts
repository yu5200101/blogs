export default (app: any) => {
  app.directive('longPress', {
    mounted(el:any, binding:any) {
      let pressTimer:any = null
      const longPressDuration = 1000

      const start = (event:any) => {
        if (event.type === 'click' && event.button !== 0) {
          return
        }

        if (pressTimer === null) {
          pressTimer = setTimeout(() => {
            binding.value()
          }, longPressDuration)
        }
      }

      const cancel = () => {
        if (pressTimer !== null) {
          clearTimeout(pressTimer)
          pressTimer = null
        }
      }

      el.addEventListener('mousedown', start)
      el.addEventListener('touchstart', start)

      el.addEventListener('click', cancel)
      el.addEventListener('mouseout', cancel)
      el.addEventListener('touchend', cancel)
      el.addEventListener('touchcancel', cancel)
    }
  })
}
