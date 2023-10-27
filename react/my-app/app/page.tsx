// import Link from "next/link";

// export default function Home() {
//   return (
//     <Link href="/dashboard">dashboard</Link>
//   )
// }
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard', { scroll: false })}>
      Dashboard
    </button>
  )
}
