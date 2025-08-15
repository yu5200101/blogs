'use client'
import styles from './index.module.scss';
import React from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image'

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
      <Image
        src="/yes.svg"
        width="20"
        height="20"
        alt=""
        role="presentation"
      />
      {pending ? 'Saving' : 'Done'}
    </button>
  )
}

export default SaveButton