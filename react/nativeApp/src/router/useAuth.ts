import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useLazyGetUserInfoQuery } from '@/stores/userSlice'
import AsyncStorage from '@react-native-async-storage/async-storage';

const isLoggedIn = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token
  } catch (error) {
    console.error('检查登录状态时出错:', error);
    return false;
  }
};

const useAuth = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [trigger] = useLazyGetUserInfoQuery();
  const currentRouteName = route.name;

  const fetchNewData = async () => {
    try {
      const result = await trigger();
      return result.data
      // 检查结果是否包含数据
    } catch (error) {
      console.error("数据刷新失败:", error);
      return false
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!(await isLoggedIn()) || !(await fetchNewData())) {
        navigation.reset({
          index: 0,
          routes: [{
            name: 'Login',
            params: { fromScreen: currentRouteName }
          }]
        });
      }
    };

    checkAuth();
  }, [navigation]);
};

export default useAuth;
