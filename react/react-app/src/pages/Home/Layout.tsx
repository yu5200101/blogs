import {
  // useLoaderData,
  useParams,
  Outlet,
  NavLink,
  Link,
  ScrollRestoration
} from 'react-router'

const Layout = () => {
  const params = useParams()

  return (
    <div>
      <NavLink to={{
        pathname: `/${params.id}`
      }}>
        home
      </NavLink>
      <Link
        to={{
          pathname: `/${params.id}/child`
        }}>
        child
      </Link>
      <main>
        {/* 滚动恢复原位置 */}
        <ScrollRestoration />
        <Outlet />  {/* 子路由在此渲染 */}
      </main>
    </div>
  );
};

export default Layout