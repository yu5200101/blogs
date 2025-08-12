'use server'
import { stat, mkdir, writeFile } from 'fs/promises'
import { join } from "path";
import mime from "mime";
import dayjs from 'dayjs';
import { addNote } from '@/lib/redis';
import { isErrorData } from '@/app/utils/tools'
import { revalidatePath } from 'next/cache';

export async function importNote(formData: FormData) {
  const file = formData.get('file') as File

  // 空值判断
  if (!file) {
    return { error: "File is required." };
  }

  // 写入文件
  const buffer = Buffer.from(await file.arrayBuffer());
  const relativeUploadDir = `/uploads/${dayjs().format("YY-MM-DD")}`;
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e) {
    if (isErrorData(e) && e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(e)
      return { error: "Something went wrong." }
    }
  }

  try {
    // 写入文件
    const uniqueSuffix = `${Math.random().toString(36).slice(-6)}`;
    const filename = file.name.replace(/\.[^/.]+$/, "")
    const uniqueFilename = `${filename}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
    await writeFile(`${uploadDir}/${uniqueFilename}`, buffer);

    // 调用接口，写入数据库
    const res = await addNote(JSON.stringify({
      title: filename,
      content: buffer.toString('utf-8'),
      updateTime: new Date()
    }))

    // 清除缓存
    revalidatePath('/', 'layout')

    return { fileUrl: `${relativeUploadDir}/${uniqueFilename}`, uid: res }
  } catch (e) {
    console.error(e)
    return { error: "Something went wrong." }
  }
}