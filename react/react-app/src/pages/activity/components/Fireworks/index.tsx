import React from 'react';
import styles from './index.module.scss';

const Fireworks: React.FC = () => {
  return (
    <>
      <div className={styles.firework}></div>
      <div className={styles.firework}></div>
      <div className={styles.firework}></div>
    </>
  );
};

export default Fireworks;