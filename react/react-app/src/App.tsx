
import stores from '@/stores'
import { Provider } from 'react-redux'
import {
  RouterProvider
} from 'react-router'
import LoginModal from '@/components/LoginModal'
import router from '@/router'

const App: React.FC = () => {
  return (
    <Provider store={stores}>
      <LoginModal />
      <RouterProvider router={router} />
    </Provider>
  )
}
export default App