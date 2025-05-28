import { NavLink, useLocation } from 'react-router'
import styles from './index.module.scss'
import { GiftOutline, SmileOutline, UnorderedListOutline } from 'antd-mobile-icons'
import classNames from 'classnames'
import { useMemo } from 'react'

const FooterBar: React.FC = () => {
  const location = useLocation()
  const isMain = useMemo(() => location.pathname === '/main', [location.pathname])
  const isOrder = useMemo(() => location.pathname === '/main/order', [location.pathname])
  const isMine = useMemo(() => location.pathname === '/main/mine', [location.pathname])

  return <>
    <div className={styles.box}>
      <NavLink
        to="/main"
        className={classNames(styles['box-item'], {
          [styles.active]: isMain
        })}>
        <GiftOutline />
        <span>首页</span>
      </NavLink>
      <NavLink
        to="/main/order"
        className={classNames(styles['box-item'], {
          [styles.active]: isOrder
        })}>
        <UnorderedListOutline />
        <span>订单</span>
      </NavLink>
      <NavLink
        to="/main/mine"className={classNames(styles['box-item'], {
          [styles.active]: isMine
        })}>
        <SmileOutline />
        <span>我的</span>
      </NavLink>
    </div>
  </>
}

export default FooterBar