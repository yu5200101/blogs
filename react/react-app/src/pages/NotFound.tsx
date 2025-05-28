import {
  Link
} from 'react-router'

function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - 页面不存在</h1>
      <p>您访问的地址有误，请检查 URL 或返回首页。</p>
      <Link to="/about">返回about</Link>
    </div>
  );
}

export default NotFound