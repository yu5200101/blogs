'use client'
import { Button, Form, Input } from 'antd-mobile';
import { useLoginMutation } from '@/app/stores/userSlice'
import storage from '@/app/utils/storage'
import lodash from '@/app/utils/lodash'
import { useRouter } from 'next/navigation';

const LoginModal: React.FC = () => {

  interface userData {
    mobile: string
    password: string
  }
  const [login] = useLoginMutation()
  const router = useRouter();
  const handleLogin = async (values: userData) => {
    try {
      // 调用登录接口（示例）
      const res = await login(values).unwrap()
      const token = lodash.get(res, 'data.token') || ''
      storage.cookie.setItem('token', token)
      // 登录成功后刷新导航状态
      router.refresh();
      // 跳转到首页或受保护页面
      router.push('/home');
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
          <Input placeholder='请输入' />
        </Form.Item>
      </Form>
  );
};

export default LoginModal;