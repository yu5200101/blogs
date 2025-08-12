import styles from './loading.module.scss'
import classNames from 'classnames'
import React from 'react'

export default function NoteSkeleton() {
  return (
    <div
      className={classNames(styles.note, styles['skeleton-container'])}
      role="progressbar"
      aria-busy="true"
    >
      <div className={styles['note-header']}>
        <div
          className={classNames(styles['skeleton'], styles['skeleton--title'])}
          style={{ height: '3rem', width: '65%', marginInline: '12px 1em' }}
        />
        <div
          className={classNames(styles['skeleton'], styles['skeleton--button'])}
          style={{ width: '8em', height: '2.5em' }}
        />
      </div>
      <div className={styles['note-preview' ]}>
        <div className={classNames(styles.skeleton, styles['v-stack'])} style={{ height: '1.5em' }} />
        <div className={classNames(styles.skeleton, styles['v-stack'])} style={{ height: '1.5em' }} />
        <div className={classNames(styles.skeleton, styles['v-stack'])} style={{ height: '1.5em' }} />
        <div className={classNames(styles.skeleton, styles['v-stack'])} style={{ height: '1.5em' }} />
      </div>
    </div>
  )
}