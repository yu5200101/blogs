import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 基础垫片pxToRem
import 'lib-flexible'
import 'babel-polyfill'
import 'intersection-observer'
// 基础样式
import '@/assets/reset.scss'
import '@/assets/main.scss'
import '@/assets/base.scss'
import '@/assets/font/font.scss'

import App from './App.vue'
import router from './router'
import plugins from './plugins'
import directives from './directives'

// navigateStart -> navigateEnd mainjs start
try {
  if (window.performance) {
    const nowTime = Date.now()
    window.time_navigationStart = window.performance.timing.navigationStart
    window.time_navigation = nowTime - window.time_navigationStart
  }
} catch (error) {
  /* empty */
}

// spa创建实例
const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(plugins)
app.use(directives)
// 渲染
app.mount('#app')
