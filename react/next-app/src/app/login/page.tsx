import LoginForm from './LoginForm'
import StoreProvider from '@/app/providers/StoreProvider'

const LoginPage: React.FC = async () => {
  return (
      <>
        <span>登录表单</span>
        <StoreProvider>
          {/* 登录表单 - 客户端组件 */}
          <LoginForm />
        </StoreProvider>
      </>
  );
};

export default LoginPage;