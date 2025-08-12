import styles from './index.module.scss';
import React from 'react';
import { useFormStatus } from 'react-dom';
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
      <img
        src="/close.svg"
        width="20px"
        height="20px"
        alt=""
        role="presentation"
      />
      Delete
    </button>
)
}

export default DeleteButton