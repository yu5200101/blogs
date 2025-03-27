import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    name: 'example',
    path: '/example',
    component: () => import('@/views/example/index.vue'),
    meta: {
      title: '例子'
    }
  }
]
export default routes