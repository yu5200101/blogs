'use client'
import { useRouter } from 'next/navigation'
import React, { useTransition, useRef} from 'react'
import { useFormStatus } from 'react-dom'
import type { ChangeEvent } from 'react'
import { importNote } from '@/app/actions'

interface ResData {
  uid?: string
  error?: string
  fileUrl?: string
}

function Submit() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Submitting' : 'Submit'}</button>
}

export default function SidebarImport() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()

  const onChange = async (e: ChangeEvent<HTMLInputElement>, type: string) => {
    const fileInput = e.target;

    if (!fileInput.files || fileInput.files.length === 0) {
      console.warn("files list is empty");
      return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);
    let data = {} as ResData
    try {
      if (type === 'first') {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          console.error("something went wrong");
          return;
        }
        data = await response.json();
      } else {
        data = await importNote(formData);
      }
      startTransition(() => router.push(`/note/${data.uid}`));
      type === 'first' && startTransition(() => router.refresh());

    } catch (error) {
      console.error("something went wrong");
    }

    // 重置 file input
    e.target.type = "text";
    e.target.type = "file";
  }

  async function upload(formData: FormData) {

    const file = formData.get('file3');
    if (!file) {
      console.warn("files list is empty");
      return;
    }
    const newFormData = new FormData();
    newFormData.append("file", file);

    try {
      const data = await importNote(newFormData);
      router.push(`/note/${data.uid}`)

    } catch (error) {
      console.error("something went wrong");
    }

    // 重置 file input
    formRef.current?.reset()
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <label htmlFor="file" style={{ cursor: 'pointer' }}>Import .md File-1</label>
        <input type="file" id="file" name="file" style={{ position : "absolute", clip: "rect(0 0 0 0)" }} onChange={ (e) => onChange(e, 'first') } accept=".md" />
      </div>
      <div>
        <label htmlFor="file2" style={{ cursor: 'pointer' }}>Import .md File-2</label>
        <input type="file" id="file2" name="file2" style={{ position : "absolute", clip: "rect(0 0 0 0)" }} onChange={ (e) => onChange(e, 'sec') } accept=".md" />
      </div>
      <form style={{ textAlign: "center" }} action={upload} ref={formRef}>
        <label htmlFor="file3" style={{ cursor: 'pointer' }}>Import .md File-3</label>
        <input type="file" id="file3" name="file3" accept=".md" />
        <div><Submit /></div>
      </form>
    </div>
  )
}
