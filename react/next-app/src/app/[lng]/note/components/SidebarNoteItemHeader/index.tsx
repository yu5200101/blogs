import React from 'react';
import styles from './index.module.scss';
import dayjs from 'dayjs';
interface SidebarNoteItemHeaderProps {
  title: string;
  updateTime: string;
}
const SidebarNoteItemHeader: React.FC<SidebarNoteItemHeaderProps> = ({title, updateTime}) => {
  return (
    <>
      <header className={styles['sidebar-header']}>
        <strong>{title}</strong>
        <small>{dayjs(updateTime).format('YYYY-MM-DD hh:mm:ss')}</small>
      </header>
    </>
  )
}

export default SidebarNoteItemHeader