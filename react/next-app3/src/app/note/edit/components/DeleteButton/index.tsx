import styles from './index.module.scss';
import React from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image'

interface DeleteButtonProps {
  formAction: (payload: FormData) => void
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ formAction }) => {
  const { pending } = useFormStatus()

  return (
    <button
      className={styles['del-btn']}
      formAction={formAction}
      type="submit"
      role="menuitem"
      disabled={pending}
    >
      <Image
        src="/close.svg"
        width="20"
        height="20"
        alt=""
        role="presentation"
      />
      Delete
    </button>
)
}

export default DeleteButton