'use client';
import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import styles from './index.module.scss'
import classNames from 'classnames';
import { useTranslation } from '@/app/i18n/client'

interface SidebarSearchFieldProps {
  lng: string
}

function Spinner({active = true}) {
  return (
    <div
      className={classNames(styles['spinner'], active && styles['spinner--active'])}
      role="progressbar"
      aria-busy={active ? 'true' : 'false'}
    />
  );
}

export default function SidebarSearchField({lng}: SidebarSearchFieldProps) {
  const { replace } = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const { t } = useTranslation(lng, 'basic')

  function handleSearch(term: string) {
    const params = new URLSearchParams(window.location.search)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className={styles.search} role="search">
      <label className={styles.offscreen} htmlFor="sidebar-search-input">
        Search for a note by title
      </label>
      <input
        id="sidebar-search-input"
        placeholder={t('search')}
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Spinner active={isPending} />
    </div>
  );
}