'use client'
import styles from './index.module.scss'
import { useAppSelector, useAppDispatch } from '@/app/stores/hook'
import { selectCount, increase, decrease } from '../stores/counterSlice'

const Page = () => {
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()
  return (
    <div className={styles.header}>
      <button onClick={() => {
        dispatch(decrease())
      }}>-</button>
      <span>{count}</span>
      <button onClick={() => {
        dispatch(increase())
      }}>+</button>
    </div>
  )
}

export default Page