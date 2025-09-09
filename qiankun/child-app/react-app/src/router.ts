import { createBrowserRouter } from 'react-router'
import App from './App'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

console.log(qiankunWindow.__POWERED_BY_QIANKUN__, 'window.__POWERED_BY_QIANKUN__')

const router = createBrowserRouter([
  {
    path: '/',
    Component: App
  }],
  {basename: qiankunWindow.__POWERED_BY_QIANKUN__ ? '/subapp' : '/'}
)
export default router