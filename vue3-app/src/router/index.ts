/*
 * @Name: 路由入口
 * @Description: 路由入口，声明路由实例
 */
import { createRouter, createWebHistory } from 'vue-router'
import routers from './routers'
import type { RouteLocationNormalized } from 'vue-router'


const router = createRouter({
  history: createWebHistory('/vue3-app'),
  routes: [
    ...routers,
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/views/404.vue')
    }
  ]
})

// 路由拦截
router.beforeEach((to: RouteLocationNormalized, from, next) => {
  window.cacheLocation = JSON.parse(JSON.stringify(window.location))
  next()
})

export default router
