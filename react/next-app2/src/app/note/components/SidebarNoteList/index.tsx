// NoteList.tsx
import React from 'react';
import styles from './index.module.scss';
import { getAllNotes } from '@/lib/redis'
import { sleepTime } from '@/app/utils/tools'
import SidebarNoteListFilter from '../SidebarNoteListFilter'
import SidebarNoteItemHeader from '../SidebarNoteItemHeader';

export default async function NoteList(): Promise<React.ReactElement> {
  await sleepTime(100) // 模拟数据加载延迟
  const notes = await getAllNotes()

  // 将 notes 对象转为 [key, value] 数组
  const arr = Object.entries(notes);

  if (arr.length === 0) {
    return <div className={styles['notes-empty']}>No notes created yet!</div>;
  }

  return (
    <SidebarNoteListFilter notes={
      arr.map(([noteId, note]) => {
        const noteData = JSON.parse(note)
        return {
          noteId,
          note: noteData,
          header: <SidebarNoteItemHeader title={noteData.title} updateTime={noteData.updateTime} />
        }
      })
    }>
    </SidebarNoteListFilter>
  );
}
