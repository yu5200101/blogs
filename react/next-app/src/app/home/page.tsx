import ClientComponent from './component/ClientComponent';
import { isAuthenticated } from '@/lib/auth';

export default async function Page() {
  const authData = await isAuthenticated();
  try {
    return <>
      <h1>服务端预加载数据</h1>
      {/* 传递数据给客户端组件 */}
      <ClientComponent initialData={authData} />
    </>
  } catch (err) {
    return <>
      <p>数据加载失败，但您已登录</p>
      {/* 传递数据给客户端组件 */}
      <ClientComponent initialData={null} />
    </>
  }
}