import HomeScreen from '@/pages/HomeScreen'
import Mine from '@/pages/Mine'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { HomeTabList } from '@/types/navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator<HomeTabList>();

export default function HomeTabs () {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;

            if (route.name === 'Main') {
              iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
            } else if (route.name === 'Mine') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            } else {
              iconName = 'ios-list';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 0,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 5,
          },
          headerShown: false,
        })}
    >
      <Tab.Screen name="Main" component={HomeScreen} />
      <Tab.Screen name="Mine" component={Mine} />
    </Tab.Navigator>
  )
}