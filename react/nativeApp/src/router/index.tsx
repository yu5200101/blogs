import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import DetailsScreen from '@/pages/DetailsScreen'
import Login from '@/pages/Login'
import { enableScreens } from 'react-native-screens';
import type { RootStackParamList, HomeTabKey } from '@/types/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import type { Route } from '@react-navigation/core';
import HomeTabs from './HomeTabs'

// 启用原生屏幕支持（必须在创建导航器之前调用）
enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  function getHeaderTitle(route: Partial<Route<string>>) {
    const routeName = (getFocusedRouteNameFromRoute(route) as HomeTabKey | null) ?? 'Main';
    switch (routeName) {
      case 'Main':
        return 'News Main';
      case 'Mine':
        return 'Mine'
      default:
        return 'News Main';
    }
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeTabs}
            options={({ route }) => ({
              headerTitle: getHeaderTitle(route),
            })}
          />
          <Stack.Screen
            name="Login"
            component={Login}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={({ route }) => ({ title: route.params.title || '详情页' })} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}