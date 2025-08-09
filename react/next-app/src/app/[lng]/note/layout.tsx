import type { Metadata } from 'next'
import SideBar from './components/Sidebar'
import styles from './index.module.scss'

export const metadata: Metadata = {
  title: 'note',
  description: '...',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className={styles.note}>
    <SideBar />
    <section className={styles.main}>{children}</section>
  </div>
}