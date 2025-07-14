'use client'
import { Button, Form, Input } from 'antd-mobile';
import { useLoginMutation } from '@/app/stores/userSlice'
import storage from '@/app/utils/storage'
import lodash from '@/app/utils/lodash'
import { useRouter } from 'next/navigation';

interface UserData {
  mobile: string
  password: string
}

// 使用高阶组件包裹登录表单
const LoginFormCore: React.FC = () => {
  const [login] = useLoginMutation()
  const router = useRouter();
  const handleLogin = async (values: UserData) => {
    try {
      const res = await login(values).unwrap()
      const token = lodash.get(res, 'token') || ''
      storage.cookie.setItem('token', token)
      router.refresh();
      router.replace('/home');
    } catch (error) {
      console.error('登录失败:', error);
    }
  };

  return (
    <Form
      layout='horizontal'
      onFinish={handleLogin}
      footer={
        <Button block type='submit' color='primary' size='large'>
          提交
        </Button>
      }>
      <Form.Item name="mobile" label='手机号' rules={[{ required: true }]}>
        <Input placeholder="手机号" />
      </Form.Item>
      <Form.Item name='password' label='密码' rules={[{ required: true }]}>
        <Input placeholder='请输入' type="password" />
      </Form.Item>
    </Form>
  );
};

export default LoginFormCore;