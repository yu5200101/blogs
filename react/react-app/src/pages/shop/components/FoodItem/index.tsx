import styles from './index.module.scss'
import { Stepper } from 'antd-mobile'
import { useAppSelector, useAppDispatch } from '@/stores/hook'
import { change, selectCountByKey } from '@/pages/shop/stores/counterSlice'
import { useListById } from '@/stores/shopList'

interface MyComponentProps {
  foodId: string,
  body: object
}
const FoodItem: React.FC<MyComponentProps> = ({foodId, body}) => {
  const dispatch = useAppDispatch()
  const count = useAppSelector(state => selectCountByKey(state, foodId))
  const data = useListById(body, foodId)
  return (<div className={styles.box}>
    <div className={styles['box-attr']}></div>
    <div className={styles['box-con']}>
      <span>{data.text}</span>
      <span className={styles['box-con-price']}>{data.price}</span>
      <Stepper
        min={0}
        defaultValue={count}
        onChange={value => {
          dispatch(change({...data, count: value}))
        }}
      />
    </div>
  </div>)
}

export default FoodItem