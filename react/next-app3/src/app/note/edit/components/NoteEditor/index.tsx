'use client'
import { useState, useActionState, useEffect } from 'react'
import NotePreview from '@/app/note/components/NotePreview'
import styles from './index.module.scss'
import classNames from 'classnames'
import {saveNote, deleteNote} from './actions'
import type { PrevState } from './actions'
import SaveButton from '../SaveButton'
import DeleteButton from '../DeleteButton'

interface NoteEditorProps {
  noteId?: string
  initialTitle: string
  initialBody: string
}

const initialState: PrevState = { message: "" };

export default function NoteEditor({
  noteId,
  initialTitle,
  initialBody
}: NoteEditorProps) {
  const [saveState, saveFormAction] = useActionState<PrevState, FormData>(saveNote, initialState)
  const [delState, delFormAction] = useActionState<PrevState, FormData>(deleteNote, initialState)
  const [title, setTitle] = useState<string>(initialTitle)
  const [body, setBody] = useState<string>(initialBody)
  const isDraft = !noteId
  useEffect(() => {
    if (saveState.errors) {
      // 处理错误
      console.log(saveState.errors, 'error')
    }
  }, [saveState])
  return (
    <div className={styles["note-editor"]}>
      <form className={styles["note-editor-form"]} autoComplete="off">
        <div className={styles["note-editor-menu"]} role="menubar">
          <input type="hidden" name="noteId" value={noteId} />
          <SaveButton formAction={saveFormAction} />
          {!isDraft && <DeleteButton formAction={delFormAction} />}
        </div>
        <div className={styles["note-editor-menu"]} >
          { saveState?.message }
          { saveState.errors && saveState.errors[0].message }
        </div>
        <label className={styles["offscreen"]} htmlFor="note-title-input">
          Enter a title for your note
        </label>
        <input
          id="note-title-input"
          type="text"
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />
        <label className={styles["offscreen"]} htmlFor="note-body-input">
          Enter the body for your note
        </label>
        <textarea
          value={body}
          id="note-body-input"
          name="body"
          onChange={(e) => setBody(e.target.value)}
        />
      </form>
      <div className={styles["note-editor-preview"]}>
        <div className={classNames(styles["label"], styles["label--preview"])} role="status">
          Preview
        </div>
        <h1 className={styles["note-title"]}>{title}</h1>
        <NotePreview>{body}</NotePreview>
      </div>
    </div>
  )
}