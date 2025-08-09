// components/EditButton.js
import Link from 'next/link'
import styles from './index.module.scss'
import React from 'react';
import classNames from 'classnames';

interface EditButtonProps {
  noteId?: string | null;
  children: React.ReactNode;
}
export default function EditButton({noteId, children}: EditButtonProps) {
  const isDraft = noteId == null;
  return (
    <Link href={`/note/edit/${noteId || ''}`} className={styles['link--unstyled']}>
      <button
        className={classNames(styles['edit-button'], isDraft ? styles['edit-button--solid'] : styles['edit-button--outline'])}
        role="menuitem">
        {children}
      </button>
    </Link>
  );
}