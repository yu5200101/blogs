import {
  Outlet,
  ScrollRestoration
} from 'react-router'
// import FooterBar from '@/components/FooterBar'

const Layout = () => {

  return (
    <div>
      {/* <FooterBar /> */}
      <main>
        {/* 滚动恢复原位置 */}
        <ScrollRestoration />
        <Outlet />  {/* 子路由在此渲染 */}
      </main>
    </div>
  );
};

export default Layout