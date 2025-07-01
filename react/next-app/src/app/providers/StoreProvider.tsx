'use client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useRef, useState, useEffect } from 'react';
import { makeStore, AppStore } from '@/app/stores';
import { persistStore, Persistor } from 'redux-persist';

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null);
  const persistorRef = useRef<Persistor | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 只在客户端初始化
    if (typeof window === 'undefined') return;

    if (!storeRef.current) {
      // 使用预加载状态或创建新 store
      storeRef.current = makeStore()
      // 创建 persistor
      persistorRef.current = persistStore(storeRef.current);
      // 标记为就绪
      setIsReady(true);
    }
  }, []);

  // 等待 store 和 persistor 初始化
  if (!isReady || !storeRef.current || !persistorRef.current || typeof window === 'undefined') {
    return <div>Loading store...</div>;
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate
        loading={null}
        persistor={persistorRef.current}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}