
import {stores, persistor} from '@/stores'
import { Provider } from 'react-redux'
import {
  RouterProvider
} from 'react-router'
import LoginModal from '@/components/LoginModal'
import router from '@/router'
import { PersistGate } from 'redux-persist/integration/react'

const App: React.FC = () => {
  return (
    <Provider store={stores}>
      <PersistGate loading={<div className="loading">加载持久化状态...</div>} persistor={persistor}>
        <LoginModal />
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  )
}
export default App