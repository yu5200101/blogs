import React, {Suspense} from 'react'
import Link from 'next/link'
import styles from './index.module.scss'
import SidebarNoteList from '../SidebarNoteList'
import EditButton from '../EditButton'
import NoteListSkeleton from '../NoteListSkeleton'
import SidebarSearchField from '../SidebarSearchField'

export default function Sidebar() {
  return (
    <>
      <section className={styles.sidebar}>
        <Link href={'/'} className={styles['sidebar-link']}>
          <section className={styles['sidebar-header']}>
            <img
              className={styles['sidebar-header-logo']}
              src="/globe.svg"
              width="22px"
              height="20px"
              alt=""
              role="presentation"
            />
            <strong>React Notes</strong>
          </section>
        </Link>
        <section className={styles['sidebar-menu']} role="menubar">
          <SidebarSearchField />
          <EditButton noteId={null}>New</EditButton>
        </section>
        <nav>
          <Suspense fallback={<NoteListSkeleton />}>
            <SidebarNoteList />
          </Suspense>
        </nav>
      </section>
    </>
  )
}