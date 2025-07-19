import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/pages/HomeScreen'
import DetailsScreen from '@/pages/DetailsScreen'
import { enableScreens } from 'react-native-screens';
// 启用原生屏幕支持（必须在创建导航器之前调用）
enableScreens();

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}