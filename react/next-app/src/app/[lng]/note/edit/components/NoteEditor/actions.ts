'use server'
import {addNote, updateNote, delNote} from '@/lib/redis';
import { revalidatePath } from 'next/cache';
import { sleepTime } from '@/app/utils/tools';
import { z } from "zod"
import { redirect } from 'next/navigation'

export type PrevState = {
  message?: string
  errors?: z.ZodIssue[]
};

const schema = z.object({
  title: z.string(),
  content: z.string().min(1, '请填写内容').max(100, '字数最多 100')
})

export async function saveNote(
  prevState: PrevState,
  formData: FormData
): Promise<PrevState> {
  const noteId = formData.get('noteId') as string;
  const data = {
    title: formData.get('title'),
    content: formData.get('body'),
    updateTime: new Date()
  }

  // 校验数据
  const validated = schema.safeParse(data)
  if (!validated.success) {
    return {
      errors: validated.error.issues,
    }
  }

  // 为了让效果更明显
  await sleepTime(2000);

  if (noteId) {
    updateNote(noteId, JSON.stringify(data));
    revalidatePath('/', 'layout');
  } else {
    const res: string = await addNote(JSON.stringify(data));
    revalidatePath('/', 'layout');
  }
  return { message: "Note saved!" };
}

export async function deleteNote(
  prevState: PrevState,
  formData: FormData
): Promise<PrevState> {
  const noteId = formData.get('noteId') as string;

  delNote(noteId);
  revalidatePath('/', 'layout');
  redirect('/note')
  return { message: "Note deleted!" };
}