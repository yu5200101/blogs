import styles from './index.module.scss'
import { Tabs, SideBar } from 'antd-mobile'
import { useThrottleFn } from 'ahooks'
import { useMemo, useState, useRef, useEffect, lazy } from 'react'
import { useGetUserInfoQuery } from '@/stores/userSlice'

const Food = lazy(() => import('./components/Food'))
const FooterCal = lazy(() => import('./components/FooterCal'))

const Shop: React.FC = () => {
  const {
    isSuccess
  } = useGetUserInfoQuery()
  const tabs = useMemo(() => ([
    {
      key: 'key1',
      title: '选项一'
    },
    {
      key: 'key2',
      title: '选项二'
    },
    {
      key: 'key3',
      title: '选项三'
    }
  ]), [])
  const mainElementRef = useRef<HTMLDivElement>(null)

  const [activeKey, setActiveKey] = useState('key1')
  const { run: handleScroll } = useThrottleFn(
    () => {
      let currentKey = tabs[0].key
      for (const item of tabs) {
        const element = document.getElementById(`anchor-${item.key}`)
        if (!element) continue
        const mainElement = mainElementRef.current
        if (!mainElement) return
        const parent = mainElement.getBoundingClientRect()
        const rect = element.getBoundingClientRect()
        if (rect.top <= parent.top + 10) {
          currentKey = item.key
        } else {
          break
        }
      }
      setActiveKey(currentKey)
    },
    {
      leading: true,
      trailing: true,
      wait: 100,
    }
  )

  useEffect(() => {
    if (!isSuccess) return
    const mainElement = mainElementRef.current
    if (!mainElement) return
    mainElement.addEventListener('scroll', handleScroll)
    return () => {
      mainElement.removeEventListener('scroll', handleScroll)
    }
  }, [isSuccess])

  return (
    <div className={styles.container}>
      <div className={styles.desc}></div>
      <Tabs
        style={{
          '--content-padding': '0'
        }}
        className={styles['main-box']}>
        <Tabs.Tab title='点餐' key='order'>
          <div className={styles['box-content']}>
            <SideBar
              activeKey={activeKey}
              onChange={key => {
                document.getElementById(`anchor-${key}`)?.scrollIntoView()
              }}
              >
              {tabs.map(item => (
                <SideBar.Item key={item.key} title={item.title} />
              ))}
            </SideBar>
            {isSuccess && (<div
              ref={mainElementRef}
              className={styles['box-content-right']}>
            {tabs.map(item => (
                <div key={item.key}>
                  <div
                    className={styles['anchor-title']}
                    id={`anchor-${item.key}`}>{item.title}</div>
                  <Food type={item.key} />
                </div>
              ))}
            </div>)}
          </div>
          <FooterCal />
        </Tabs.Tab>
        <Tabs.Tab title='评价' key='vegetables'>
          评价
        </Tabs.Tab>
        <Tabs.Tab title='商家' key='animals'>
          商家
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}

export default Shop