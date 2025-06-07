import React, { useState, useEffect, lazy, Suspense } from 'react';

const Button = lazy(() => import('@/components/Button'))
// 定义组件Props接口
interface AppProps {
  title?: string; // 可选属性
}

// 函数组件
const App: React.FC<AppProps> = ({ title = 'React + TypeScript' }) => {
  const [count, setCount] = useState<number>(0); // 明确状态类型
  useEffect(() => {
    document.title = `${title} - Clicks: ${count}`;
  }, [count, title]);
  const increment = () => setCount(prev => prev + 1);
  return (
    <div className="app">
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <Suspense fallback={'loading...'}>
        <Button onClick={increment}>Increment</Button>
      </Suspense>
    </div>
  );
};

export default App;