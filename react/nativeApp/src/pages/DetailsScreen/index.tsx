import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import {
  useNavigation,
  useFocusEffect
} from '@react-navigation/native'
import { Button } from '@react-navigation/elements';
import { useCallback } from 'react'

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function DetailsScreen({ route }: Props) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useFocusEffect(
      useCallback(() => {
        // Do something when the screen is focused
        console.log('ProfileScreen focus effect');

        return () => {
          // Do something when the screen is unfocused
          // Useful for cleanup functions
          console.log('ProfileScreen focus effect cleanup');
        };
      }, [])
    );

   // 安全访问路由参数（带默认值）
  const { id, title = '默认标题', data } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>详情屏幕</Text>
      <Text>ID: {id}</Text>
      <Text>标题: {title}</Text>
      <Text>数据: {JSON.stringify(data || '无数据')}</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
      <Button onPress={() => navigation.popTo('Home', {
      })}>Go to Home</Button>
      <Button onPress={() => navigation.popToTop()}>
        Go back to first screen in stack
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  }
});

