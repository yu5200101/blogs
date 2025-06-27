// import { useAppSelector, useAppDispatch } from '@/stores/hook'
import styles from './index.module.scss'
// import { useGetUserInfoQuery, selectUsersData } from '@/stores/userSlice'
// import classNames from 'classnames'
// import { Link } from 'react-router'
import { useState, useRef } from 'react'
// import { useEffect } from 'react'
// import { SearchOutline } from 'antd-mobile-icons'

function Home() {
  // const {
  //   data,
  //   isSuccess
  // } = useGetUserInfoQuery()
  // `state` 参数已正确推断为 `RootState` 类型
  // const count = useAppSelector()
  // const dispatch = useAppDispatch()
  const [count, setCount] = useState(0);
  const [otherCount, setOtherCount] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null | number>(0)

  const handleClick = (type: string) => {
    if (type === '-') {
      setCount(count - 1);
    } else if (type === '+') {
      setCount(count + 1)
    } else if (type === 'start') {
      setTimeout(() => {
        setOtherCount(otherCount + 1)
      }, 1000)
    } else if (type === 'end') {
      clearTimeout(timer.current as number)
    }
  };
  // useEffect(() => {
  //   timer.current = setTimeout(() => {
  //     setOtherCount(otherCount + 1)
  //   }, 1000)
  //   return () => {
  //     clearTimeout(timer.current as number)
  //   }
  // }, [otherCount])

  return <>
    <div className={styles.container}>
      {/* <Link
        className={styles['search-header']}
        to="/search">
        <SearchOutline />
        <span className={styles['search-header-title']}>必胜客</span>
        <span className={styles['search-header-btn']}>搜索</span>
      </Link>
      <Link to="/shop">
        好吃的店铺
      </Link> */}
      <div>
        <button onClick={() => handleClick('-')}>-1</button>
        <span>{count}</span>
        <button onClick={() => handleClick('+')}>+1</button>
        <button onClick={() => handleClick('start')}>start</button>
        <span>{otherCount}</span>
        <button onClick={() => handleClick('end')}>end</button>
      </div>
    </div>
  </>
}

export default Home