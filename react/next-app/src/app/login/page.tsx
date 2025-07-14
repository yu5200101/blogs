import LoginForm from './LoginForm'
const LoginPage: React.FC = async () => {
  return (
      <>
        <span>登录表单</span>
        {/* 登录表单 - 客户端组件 */}
        <LoginForm />
      </>
  );
};

export default LoginPage;