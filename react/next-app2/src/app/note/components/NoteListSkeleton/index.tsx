import classNames from 'classnames';
import styles from './index.module.scss';
import React from 'react';

export default function NoteListSkeleton() {
  return (
    <div>
      <ul className={classNames(styles['notes-list'], styles['skeleton-container'])}>
        <li className={styles['v-stack']}>
          <div
            className={classNames(styles['sidebar-note-list-item'], styles['skeleton'])}
            style={{height: '5em'}}
          />
        </li>
        <li className={styles['v-stack']}>
          <div
            className={classNames(styles['sidebar-note-list-item'], styles['skeleton'])}
            style={{height: '5em'}}
          />
        </li>
        <li className={styles['v-stack']}>
          <div
            className={classNames(styles['sidebar-note-list-item'], styles['skeleton'])}
            style={{height: '5em'}}
          />
        </li>
      </ul>
    </div>
  );
}