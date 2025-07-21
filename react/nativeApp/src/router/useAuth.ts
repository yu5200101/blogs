import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { isLoggedIn } from './auth';
import { useRoute } from '@react-navigation/native';
import { useGetUserInfoQuery } from '@/stores/userSlice'

const useAuth = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { data } = useGetUserInfoQuery()
  const currentRouteName = route.name;

  useEffect(() => {
    const checkAuth = async () => {
      if (!(await isLoggedIn()) || !data) {
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
