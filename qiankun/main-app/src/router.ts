import { createBrowserRouter } from 'react-router'
import App from './App'
import SubContainer from './SubContainer'

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  { path: '/subapp/*', Component: SubContainer }
]);

export default router