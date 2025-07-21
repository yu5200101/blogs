import AsyncStorage from '@react-native-async-storage/async-storage';

export const isLoggedIn = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token
  } catch (error) {
    console.error('检查登录状态时出错:', error);
    return false;
  }
};
