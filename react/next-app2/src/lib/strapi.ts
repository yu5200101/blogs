
const Authorization = 'bearer fbb027acc2f94124836c799cb2b7c6c5f82ad95953e34890ccea4dd319e65d8b91c2c3174bad1e4bd0fe62f06bd70e41d821f7bb2d2ee5ede7f740a53e7421a85a75a82b47f1b6ede25504eb8cf576035e49dfa32601390dc38d8b6f9b3c548a9358870cc93d323956d13b4782bf3e3a8347e8b8f96c8bfb76f103a0d579ef4a'

interface Note {
  title: string;
  content: string;
  documentId: string
  updateTime: string; // ISO 8601 格式字符串
  updatedAt?: string
  slug?: number
}
interface ResData {
  [key: string]: string
}

export async function getAllNotes() {
  const response = await fetch(`http://localhost:1337/api/notes`)
  const data = await response.json();

  const res = {} as ResData;

  data.data.forEach(({documentId, title, content, updatedAt}: Note) => {
    res[documentId as string] = JSON.stringify({
      title,
      content,
      updateTime: updatedAt
    })
  })

  return res
}

export async function addNote(data: string) {
  const response = await fetch(`http://localhost:1337/api/notes`, {
    method: 'POST',
    headers: {
      Authorization,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      data: JSON.parse(data)
    })
  })
  const res = await response.json();
  return res.data
}

export async function updateNote(documentId: string, data: string) {
  await fetch(`http://localhost:1337/api/notes/${documentId}`, {
    method: 'PUT',
    headers: {
      Authorization,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      data: JSON.parse(data)
    })
  })
}

export async function getNote(documentId: string) {
  const response = await fetch(`http://localhost:1337/api/notes/${documentId}`)
  const data = await response.json();
  return JSON.stringify({
    title: data.data.title,
    content: data.data.content,
    updateTime: data.data.updatedAt
  })
}

export async function delNote(documentId: string) {
  const response = await fetch(`http://localhost:1337/api/notes/${documentId}`, {
    method: 'DELETE',
    headers: {
      Authorization,
      "Content-Type": "application/json"
    }
  })
  const res = await response.json()
}
