'use client';
import { useState } from 'react';
import StoreProvider from '@/app/providers/StoreProvider'
import RefreshButton from './RefreshButton'

interface Props {
  initialData: any;
}

export default function ClientComponent({ initialData }: Props) {
  const [data, setData] = useState(initialData);

  return (
    <div>
      <StoreProvider>
        <RefreshButton setData={setData}/>
      </StoreProvider>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}