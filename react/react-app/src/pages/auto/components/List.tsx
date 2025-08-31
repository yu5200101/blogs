import React, { useCallback, use, Suspense, useMemo } from 'react';
import styles from './index.module.scss';
import { ErrorBoundary } from "react-error-boundary";

const LIST = [
  '望馨花园',
  '美佳苑',
  '好好花园',
  '心念苑'
];

interface Props {
  cachedPromise: Promise<string[]>;
}
interface ParentProps {
  query: string
}

const Default: React.FC<ParentProps> = ({ query }) => {

  const fetchData = useCallback((val: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = LIST.filter(item => item.includes(val));
        if (list.length) {
          resolve(list);
        } else {
          reject('无匹配结果');
        }
      }, 1000);
    });
  }, [])
  // 在父组件中创建Promise并缓存
  const cachedPromise = useMemo(() => fetchData(query) as Promise<string []>, [query, fetchData])

  if (!query) return null

  return (
    <ErrorBoundary fallback={<span>失败</span>}>
      <Suspense fallback={<div>加载中...</div>}>
        <ListComponent cachedPromise={cachedPromise} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Default;

const ListComponent: React.FC<Props> = React.memo(({ cachedPromise }) => {

  // 使用use API读取Promise
  const positionList = use(cachedPromise) as string[];

  return (
    <div className={styles.box}>
      {positionList.map(item => (
        <span key={item} className={styles.title}>{item}</span>
      ))}
    </div>
  );
})

