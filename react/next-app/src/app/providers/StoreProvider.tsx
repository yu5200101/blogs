'use client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import React, { useRef} from 'react';
import { makeStore, AppStore } from '@/app/stores';
import { persistStore, Persistor } from 'redux-persist';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null);
  const persistorRef = useRef<Persistor | null>(null);
  storeRef.current = makeStore();
  persistorRef.current = persistStore(storeRef.current)
  return (
    <Provider store={storeRef.current}>
      <PersistGate
        loading={<LoadingOverlay />}
        persistor={persistorRef.current}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}