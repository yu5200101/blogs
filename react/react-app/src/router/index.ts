import { createBrowserRouter } from 'react-router'
import type { LoaderFunctionArgs } from 'react-router'
import Layout from '@/pages/home/Layout'
import home from '@/pages/home'
import order from '@/pages/order'
import mine from '@/pages/mine'
import search from '@/pages/search'
import shop from '@/pages/shop'
import NotFound from '@/pages/NotFound'

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
    }]
  }, {
    path: '/search',
    loader: loader,
    Component: search
  }, {
    path: '/shop',
    loader: loader,
    Component: shop
  }, {
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