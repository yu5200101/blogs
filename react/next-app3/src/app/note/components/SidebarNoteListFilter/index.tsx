// NoteList.tsx
'use client'
import React from 'react';
import styles from './index.module.scss';
import { useSearchParams } from 'next/navigation';
import SidebarNoteItemContent from '../SidebarNoteItemContent'

type Note = {
  noteId: string;
  note: {
    title: string;
    content: string;
  };
  header?: React.ReactNode;
};

interface SidebarNoteListFilterProps {
  notes: Note[];
}

export default function SidebarNoteListFilter({notes}: SidebarNoteListFilterProps) {
  const searchParams = useSearchParams();
  const searchText = searchParams.get('q');

  return (
    <ul className={styles['notes-list']}>
      {notes.map(noteItem => {
        const {noteId, note, header} = noteItem;
        if (!searchText || (searchText && note.title.toLowerCase().includes(searchText.toLowerCase()))) {
          return (
            <SidebarNoteItemContent
              key={noteId}
              id={noteId}
              title={note.title}
              expandedChildren={
                <p className={styles['sidebar-note-excerpt']}>
                  {note.content.substring(0, 20) || <i>(No content)</i>}
                </p>
              }>
              {header}
            </SidebarNoteItemContent>
          )
        }
        return null
      })}
    </ul>
  );
}
