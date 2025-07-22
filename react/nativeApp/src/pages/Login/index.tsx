import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import rules from '@/utils/rules'
import { useLoginMutation } from '@/stores/userSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setToken } from '@/stores/authSlice'
import { useAppDispatch } from '@/stores/hook'
import lodash from '@/utils/lodash'
import { RootStackParamList } from '@/types/navigation';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useNavigation,
} from '@react-navigation/native'

interface userData {
  mobile: string
  password: string
}

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ route }: Props) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [login] = useLoginMutation()
  const dispatch = useAppDispatch()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const fromScreen = route.params?.fromScreen || 'Unknown';

  const navigateToDetails = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home', params: { screen: fromScreen } }],
    });
  };

  const submitLogin = async (values: userData) => {
    try {
      // 调用登录接口（示例）
      const res = await login(values).unwrap()
      const token = lodash.get(res, 'token') || ''
      dispatch(setToken(token))
      await AsyncStorage.setItem('token', token)
      navigateToDetails()
    } catch (error) {
      setLoading(false);
      console.error('登录失败:', error);
    }
  }

  const handleLogin = () => {
    if (!rules.verifyPhone.test(mobile)) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }
    if (password.length < 6) {
      Alert.alert('提示', '密码长度至少6位');
      return;
    }
    setLoading(true);
    // 调用登录API
    submitLogin({mobile, password});
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="请输入手机号"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
        maxLength={11}
      />
      <TextInput
        style={styles.input}
        placeholder="请输入密码"
        secureTextEntry
        value={password}
        maxLength={6}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? '登录中...' : '登录'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#1890ff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default LoginScreen;
