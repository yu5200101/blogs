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
import { SafeAreaView, StyleSheet } from 'react-native';

function App() {
  return (
    <Provider store={stores}>
      <PersistGate loading={<ActivityIndicator size="large" />} persistor={persistor}>
        <SafeAreaView style={styles.container}>
          <RootStack />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;


