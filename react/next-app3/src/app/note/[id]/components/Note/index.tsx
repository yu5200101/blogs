import dayjs from 'dayjs';
import NotePreview from '@/app/note/components/NotePreview'
import EditButton from '@/app/note/components/EditButton'
import styles from './index.module.scss';

interface NoteProps {
  noteId: string;
  note: {
    title: string;
    content: string;
    updateTime: string;
  }
}
export default function Note({ noteId, note }: NoteProps) {
  const { title, content, updateTime } = note

  return (
    <div className={styles.note}>
      <div className={styles['note-header']}>
        <h1 className={styles['note-title']}>{title}</h1>
        <div className={styles['note-menu']} role="menubar">
          <small className={styles['note-update-at']}  role="status">
            Last updated on {dayjs(updateTime).format('YYYY-MM-DD hh:mm:ss')}
          </small>
            <EditButton noteId={noteId}>Edit</EditButton>
        </div>
      </div>
      <NotePreview>{content}</NotePreview>
    </div>
  )
}