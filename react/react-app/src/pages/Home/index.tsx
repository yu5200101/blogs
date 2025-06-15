// import { useAppSelector, useAppDispatch } from '@/stores/hook'
import styles from './index.module.scss'
// import { useGetUserInfoQuery, selectUsersData } from '@/stores/userSlice'
// import classNames from 'classnames'
// import { Link } from 'react-router'
import { useState } from 'react'
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

  const showMessage = () => {
    setCount(count + 1);
  };
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
        <span>{count}</span>
        {count === 1 && <span key="1">展示1</span>}
        {count === 2 && <span key="2">展示2</span>}
        {count === 3 && <span key="3">展示3</span>}
        <button onClick={showMessage}>+1</button>
      </div>
    </div>
  </>
}

export default Home