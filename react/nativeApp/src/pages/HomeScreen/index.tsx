import { View, Text, StyleSheet } from 'react-native';
import {
  useNavigation,
} from '@react-navigation/native'
import { Button } from '@react-navigation/elements';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const navigateToDetails = () => {
    navigation.navigate('Details', {
      id: 'item-123',
      title: '产品详情',
      data: { price: 99.99, stock: 10 }
    });
  };

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button onPress={navigateToDetails}>
        Go to Details
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

