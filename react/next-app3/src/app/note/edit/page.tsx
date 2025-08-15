import NoteEditor from './components/NoteEditor'

export default async function EditPage() {
  return <NoteEditor noteId={undefined} initialTitle="Untitled" initialBody="" />
}