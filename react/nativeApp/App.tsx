/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import RootStack from '@/router'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { stores, persistor } from '@/stores'
import { ActivityIndicator } from 'react-native'

console.log('stores:', stores)
function App() {
  return (
    <Provider store={stores}>
      <PersistGate loading={<ActivityIndicator size="large" />} persistor={persistor}>
        <RootStack />
      </PersistGate>
    </Provider>
  );
}

export default App;


