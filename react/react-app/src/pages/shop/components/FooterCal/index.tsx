import { memo } from "react"
import styles from './index.module.scss'
import { selectTotalPrice } from '@/pages/shop/stores/counterSlice'
import { useAppSelector } from '@/stores/hook'

const FooterCal: React.FC = memo(() => {
  const total = useAppSelector(state => selectTotalPrice(state))
  return <>
    <div className={styles.box}>
      <div>{total}元</div>
    </div>
  </>
})

export default FooterCal