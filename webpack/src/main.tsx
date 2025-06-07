import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/styles/global.scss'; // 如果有样式文件
import App from './App';

// 类型断言确保元素存在
const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
