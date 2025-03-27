import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import type { Pinia } from 'pinia'
import router from '@/router'
import OtherLoading from './OtherLoading.vue'

const pinia: Pinia = createPinia()

let otherLoading: any = null

export const setOtherLoading = (flag: boolean = false, type?: string) => {
  if (!otherLoading) {
    const app = createApp({
      render() {
        return h(OtherLoading, { ref: 'otherLoading' })
      }
    })

    app.use(pinia)
    app.use(router)
    const appContainer = document.createElement('div')
    otherLoading = app.mount(appContainer)
    document.body.appendChild(otherLoading.$el)
  }

  flag ? otherLoading.$refs.otherLoading.show(type) : otherLoading.$refs.otherLoading.close()
}