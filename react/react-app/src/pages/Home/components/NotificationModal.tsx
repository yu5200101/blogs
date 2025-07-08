import React from 'react';
import { Popup } from 'antd-mobile';
import type { ModalProps } from './modalTypes';
import styles from './index.module.scss';

const WelcomeModal: React.FC<ModalProps> = ({
  open,
  title,
  message,
  onClose,
  className
}) => {
  return (
    <Popup
      bodyClassName={`${styles.main} ${className || ''}`}
      visible={open}
      showCloseButton
      onClose={onClose}
    >
      <div className={styles.modalContent}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
      </div>
    </Popup>
  );
};

export default WelcomeModal;