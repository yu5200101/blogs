import { createBrowserRouter } from 'react-router'
import type { LoaderFunctionArgs } from 'react-router'
import Layout from '@/pages/Home/Layout'
import Home from '@/pages/Home'
import Child from '@/pages/Home/Child'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/:id',
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
      Component: Home
    }, {
      path: 'child',
      loader: loader,
      Component: Child
    }]
  },
  {
    path: '/about',
    loader: loader,
    Component: About
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