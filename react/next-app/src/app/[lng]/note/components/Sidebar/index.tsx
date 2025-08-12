import React, {Suspense} from 'react'
import Link from 'next/link'
import styles from './index.module.scss'
import SidebarNoteList from '../SidebarNoteList'
import EditButton from '../EditButton'
import NoteListSkeleton from '../NoteListSkeleton'
import SidebarSearchField from '../SidebarSearchField'
import SidebarImport from '../SidebarImport'
import { useTranslation } from "@/app/i18n"

interface SideBarProps {
  lng: string
}
export default async function Sidebar({lng}: SideBarProps) {
  const { t } = await useTranslation(lng)
  return (
    <>
      <section className={styles.sidebar}>
        <Link href={'/'} className={styles['sidebar-link']}>
          <section className={styles['sidebar-header']}>
            <img
              className={styles['sidebar-header-logo']}
              src="/logo.svg"
              width="22px"
              height="20px"
              alt=""
              role="presentation"
            />
            <strong>React Notes</strong>
          </section>
        </Link>
        <section className={styles['sidebar-menu']} role="menubar">
          <SidebarSearchField lng={lng} />
          <EditButton noteId={null}>{t('new')}</EditButton>
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