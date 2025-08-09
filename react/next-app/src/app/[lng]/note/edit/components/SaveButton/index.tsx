'use client'
import styles from './index.module.scss';
import React from 'react';
import { useFormStatus } from 'react-dom';

interface SaveButtonProps {
  formAction: (payload: FormData) => void
}
const SaveButton: React.FC<SaveButtonProps> = ({ formAction }) => {
  const { pending } = useFormStatus()
  return (
    <button
      className={styles['save-btn']}
      formAction={formAction}
      type="submit"
      role="menuitem"
      disabled={pending}
    >
      <img
        src="/yes.svg"
        width="20px"
        height="20px"
        alt=""
        role="presentation"
      />
      {pending ? 'Saving' : 'Done'}
    </button>
  )
}

export default SaveButton