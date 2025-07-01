import Link from 'next/link'

const Page = () => {
  return (
    <div>
      <span>page</span>
      <Link href={`/example/2`}>jump</Link>
    </div>
  )
}

export default Page