import {
  useParams,
  useLoaderData,
  NavLink
} from 'react-router'
import { decrement, increment, selectCount } from './stores'
import { useAppSelector, useAppDispatch } from '@/stores/hook'
import styles from './index.module.scss'
import { useGetUserInfoQuery, selectUsersData } from '@/stores/userSlice'
import classNames from 'classnames'

function Home() {
  const {
    data,
    isSuccess
  } = useGetUserInfoQuery()
  const params = useParams()
  const loaderData = useLoaderData()
  const userData = useAppSelector(state => selectUsersData(state))
  // `state` 参数已正确推断为 `RootState` 类型
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()
  return <>
    <h1 className={styles.header}>{loaderData.params.id}</h1>
    <h1 className={styles.header}>{params.id}</h1>
    <div className={styles.box}>
      <span className={classNames({[styles.title]: isSuccess})}>标题</span>
      <span>{JSON.stringify(userData)}</span>
      <span>{JSON.stringify(data)}</span>
    </div>
    <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    <NavLink
      to="/about"
      className={({ isActive, isPending, isTransitioning }) =>
        classNames({
          [styles.active]: isActive
        }, {
          [styles.pending]: isPending
        }, {
          [styles.transitioning]: isTransitioning
        })
      }
    >
      about1
    </NavLink>
    <NavLink
      to="/about"
      style={({ isActive, isPending, isTransitioning }) => {
        return {
          fontWeight: isActive ? "bold" : "",
          color: isPending ? "red" : "black",
          viewTransitionName: isTransitioning ? "slide" : "",
        };
      }}
    >
      about2
    </NavLink>
  </>
}

export default Home