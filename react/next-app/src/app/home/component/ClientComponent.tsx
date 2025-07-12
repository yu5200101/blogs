// components/ClientComponent.tsx
'use client';
import { useState } from 'react';
import { useGetUserInfoQuery } from '@/app/stores/userSlice'
interface Props {
  initialData: any
}
export default function ClientComponent({ initialData }: Props) {
  // 使用服务端预加载数据
  const [data, setData] = useState(initialData);

  // 客户端数据更新
  const fetchNewData = async () => {
    const {
      data
    } = useGetUserInfoQuery()
    setData(data);
  };

  return (
    <div>
      <button onClick={fetchNewData}>刷新数据</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}