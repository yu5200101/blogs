export default (app: any) => {
  app.directive('lazy', {
    mounted(el:any, binding:any) {
      el.setAttribute('data-src', binding.value)
      const observer = new IntersectionObserver(changes => {
        changes.forEach(change => {
          if (change.isIntersecting) {
            const image = new Image()
            image.src = binding.value
            image.onload = () => {
              el.src = image.src
              observer.unobserve(el)
            }
            image.onerror = () => {
              console.error('图片加载失败:', binding.value)
            }
          }
        })
      }, {
        rootMargin: '0px',
        threshold: 0.1
      })
      el._observer = observer
      observer.observe(el)
    },
    updated(el:any, binding:any) {
      if (binding.value !== binding.oldValue) {
        el.setAttribute('data-src', binding.value)
        el._observer.unobserve(el)
        el._observer.observe(el)
      }
    },
    unmounted(el:any) {
      el._observer.disconnect()
      delete el._observer
    }
  })
}