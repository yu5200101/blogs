import NoteEditor from '../components/NoteEditor'
import {getNote} from '@/lib/redis';
import { sleepTime } from '@/app/utils/tools';
import styles from './index.module.scss';

interface EditPageProps {
  params: { id: string }
}
export default async function EditPage({ params }: EditPageProps) {
  const { id: noteId } = await params
  const noteStr = await getNote(noteId);

  // 让效果更明显
  await sleepTime(100);

  if (noteStr === null) {
    return (
      <div className={styles["note--empty-state"]}>
        <span className={styles["note-text--empty-state"]}>
          Click a note on the left to view something! 🥺
        </span>
      </div>
    )
  }

  let note: { title: string; content: string };
  try {
    note = JSON.parse(noteStr);
  } catch {
    return (
      <div className={styles["note--empty-state"]}>
        <span className={styles["note-text--empty-state"]}>
          Failed to load note data.
        </span>
      </div>
    );
  }

  return <NoteEditor noteId={noteId} initialTitle={note.title} initialBody={note.content} />
}