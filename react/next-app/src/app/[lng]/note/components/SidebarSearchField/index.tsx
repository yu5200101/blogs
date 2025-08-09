'use client';
import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import styles from './index.module.scss'
import classNames from 'classnames';
function Spinner({active = true}) {
  return (
    <div
      className={classNames(styles['spinner'], active && styles['spinner--active'])}
      role="progressbar"
      aria-busy={active ? 'true' : 'false'}
    />
  );
}

export default function SidebarSearchField() {
  const { replace } = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

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
        placeholder="Search"
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Spinner active={isPending} />
    </div>
  );
}