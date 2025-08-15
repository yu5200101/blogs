import styles from './loading.module.scss'
import classNames from 'classnames'
import React from 'react'

export default function EditSkeleton() {
  return (
    <div
      className={classNames(styles['note-editor'], styles['skeleton-container'])}
      role="progressbar"
      aria-busy="true"
    >
      <div className={styles['note-editor-form']}>
        <div className={classNames(styles.skeleton, styles['v-stack'])} style={{ height: '3rem' }} />
        <div className={classNames(styles.skeleton, styles['v-stack'])} style={{ height: '100%' }} />
      </div>
      <div className={styles['note-editor-preview']}>
        <div className={styles['note-menu']}>
          <div
            className={classNames(styles.skeleton, styles['skeleton--button'])}
            style={{ width: '8em', height: '2.5em' }}
          />
          <div
            className={classNames(styles.skeleton, styles['skeleton--button'])}
            style={{ width: '8em', height: '2.5em', marginInline: '12px 0' }}
          />
        </div>
        <div
          className={classNames(styles['note-title'], styles.skeleton)}
          style={{ height: '3rem', width: '65%', marginInline: '12px 1em' }}
        />
        <div className={styles['note-preview']}>
          <div className={classNames(styles.skeleton, styles['v-stack'])} style={{ height: '1.5em' }} />
          <div className={classNames(styles.skeleton, styles['v-stack'])} style={{ height: '1.5em' }} />
          <div className={classNames(styles.skeleton, styles['v-stack'])} style={{ height: '1.5em' }} />
          <div className={classNames(styles.skeleton, styles['v-stack'])} style={{ height: '1.5em' }} />
          <div className={classNames(styles.skeleton, styles['v-stack'])} style={{ height: '1.5em' }} />
        </div>
      </div>
    </div>
  )
}