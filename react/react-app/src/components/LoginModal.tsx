// src/components/LoginModal.tsx
import { Popup, Button, Form, Input } from 'antd-mobile';
import { useAppDispatch, useAppSelector } from '@/stores/hook';
import { closeLoginModal } from '@/stores/authSlice';
import { useLoginMutation } from '@/stores/userSlice'
import storage from '@/utils/storage'
import lodash from '@/utils/lodash'

const LoginModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.auth.isLoginModalOpen);

  interface userData {
    mobile: string
    password: string
  }
  const [login, {isSuccess}] = useLoginMutation()
  const handleLogin = async (values: userData) => {
    try {
      // 调用登录接口（示例）
      const res = await login(values).unwrap()
      const token = lodash.get(res, 'data.token') || ''
      storage.localStorage.setItem('token', token)
      dispatch(closeLoginModal()); // 登录成功后关闭弹窗
      window.location.reload();    // 刷新页面重新获取数据
    } catch (error) {
      console.error('登录失败:', error);
    }
  };

  return (
    <Popup
      visible={isOpen}
    >
      {isSuccess && <span>success</span>}
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
    </Popup>
  );
};

export default LoginModal;