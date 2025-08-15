import Note from './components/Note';
// import {getNote} from '@/lib/strapi';
import { getNote } from '@/lib/prisma';
import { sleepTime } from '@/app/utils/tools';

interface PageProps {
  params: { id: string }
}

export default async function Page({ params }: PageProps) {
  // 动态路由 获取笔记 id
  const { id: noteId } = await params
  const noteData = await getNote(noteId)

  // 为了让 Suspense 的效果更明显
  await sleepTime(100);

  if (!noteData) {
    return (
      <div className="note--empty-state">
        <span className="note-text--empty-state">
          Click a note on the left to view something! 🥺
        </span>
      </div>
    )
  }

  // If noteData is a string, parse it to object
  const note = typeof noteData === 'string' ? JSON.parse(noteData) : noteData;

  return <Note noteId={noteId} note={note} />
}
