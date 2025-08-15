import React, {Suspense} from 'react'
import Link from 'next/link'
import styles from './index.module.scss'
import SidebarNoteList from '../SidebarNoteList'
import EditButton from '../EditButton'
import NoteListSkeleton from '../NoteListSkeleton'
import SidebarSearchField from '../SidebarSearchField'
import SidebarImport from '../SidebarImport'
import Image from 'next/image'

export default async function Sidebar() {
  return (
    <>
      <section className={styles.sidebar}>
        <Link href={'/'} className={styles['sidebar-link']}>
          <section className={styles['sidebar-header']}>
            <Image
              className={styles['sidebar-header-logo']}
              src="/logo.svg"
              width="22"
              height="20"
              alt=""
              role="presentation"
            />
            <strong>React Notes</strong>
          </section>
        </Link>
        <section className={styles['sidebar-menu']} role="menubar">
          <SidebarSearchField />
          <EditButton noteId={null}>new</EditButton>
        </section>
        <nav>
          <Suspense fallback={<NoteListSkeleton />}>
            <SidebarNoteList />
          </Suspense>
        </nav>
        <SidebarImport />
      </section>
    </>
  )
}