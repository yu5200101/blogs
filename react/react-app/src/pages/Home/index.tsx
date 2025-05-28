// import { useAppSelector, useAppDispatch } from '@/stores/hook'
import styles from './index.module.scss'
// import { useGetUserInfoQuery, selectUsersData } from '@/stores/userSlice'
// import classNames from 'classnames'
import { Link } from 'react-router'
import { SearchOutline } from 'antd-mobile-icons'

function Home() {
  // const {
  //   data,
  //   isSuccess
  // } = useGetUserInfoQuery()
  // `state` 参数已正确推断为 `RootState` 类型
  // const count = useAppSelector()
  // const dispatch = useAppDispatch()
  return <>
    <div className={styles.container}>
      <Link
        className={styles['search-header']}
        to="/search">
        <SearchOutline />
        <span className={styles['search-header-title']}>必胜客</span>
        <span className={styles['search-header-btn']}>搜索</span>
      </Link>
      <Link to="/shop">
        好吃的店铺
      </Link>
    </div>
  </>
}

export default Home