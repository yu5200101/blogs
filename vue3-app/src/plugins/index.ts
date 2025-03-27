import type { App } from 'vue'
import lazyPlugin from 'vue3-lazy'

export default {
  install: (app: App) => {
    // 懒加载
    app.use(lazyPlugin, {
      loading: '',
      error: ''
    })
  }
}
