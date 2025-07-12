'use client';
import { useState } from 'react';
import { useLazyGetUserInfoQuery } from '@/app/stores/userSlice'; // 注意：使用 lazy 版本

interface Props {
  initialData: any;
}

export default function ClientComponent({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  // 使用 lazy query 替代常规查询
  const [trigger, { isFetching }] = useLazyGetUserInfoQuery();

  const fetchNewData = async () => {
    try {
      const result = await trigger();
      // 检查结果是否包含数据
      if (result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.error("数据刷新失败:", error);
    }
  };

  return (
    <div>
      <button
        onClick={fetchNewData}
        disabled={isFetching}
      >
        {isFetching ? '加载中...' : '刷新数据'}
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}