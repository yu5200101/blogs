import { View, Text, StyleSheet } from 'react-native';
import {
  useNavigation,
} from '@react-navigation/native'
import { Button } from '@react-navigation/elements';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Details')}>
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

