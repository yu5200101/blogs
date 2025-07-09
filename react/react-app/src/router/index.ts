import { createBrowserRouter } from 'react-router'
import type { LoaderFunctionArgs, RouteObject } from 'react-router'
import Layout from '@/pages/home/Layout'
import home from '@/pages/home'
import order from '@/pages/order'
import mine from '@/pages/mine'
import NotFound from '@/pages/NotFound'

// 1. 批量加载 pages 目录下的模块（Vite 的 glob 功能）
const modules = import.meta.glob('@/pages/**/*.tsx')

const IGNORE_PATH = ['components', 'home']
// 2. 转换为路由对象数组（lazy routes）
const routes: RouteObject[] = Object.keys(modules).map((filePath) => {
  const lazyImport = modules[filePath] as () => Promise<{ default: React.ComponentType }>

  // 获取路由路径
  let routePath = filePath
    .replace('/src/pages', '')
    .replace(/\.tsx$/, '')
    .replace(/\/index$/, '/')        // /about/index.tsx -> /about/
    .replace(/\[([^\]]+)\]/g, ':$1') // 动态参数 [id] -> :id

  if (routePath === '') routePath = '/'

  return {
    path: routePath,
    lazy: async () => {
      const { default: Component } = await lazyImport()
      return { Component }
    },
  }
}).filter((item) => !IGNORE_PATH.some(path => item.path.includes(path)))

const router = createBrowserRouter([
  {
    path: '/main',
    // loader可以做路由守卫的功能
    loader: () => {
      // const navigate = useNavigate()
      // navigate('1/child', {
      //   replace: true
      // })
    },
    Component: Layout,
    children: [{
      index: true,
      loader: loader,
      Component: home
    }, {
      path: 'order',
      loader: loader,
      Component: order
    }, {
      path: 'mine',
      loader: loader,
      Component: mine
    }],
  },
    ...routes,
  {
    path: '*',
    loader: loader,
    Component: NotFound
  }
])

async function loader({ params } : LoaderFunctionArgs) {
  return {
    params
  }
}

export default router