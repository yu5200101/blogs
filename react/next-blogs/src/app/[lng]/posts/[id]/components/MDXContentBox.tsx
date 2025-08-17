'use client'

import { useMDXComponent } from 'next-contentlayer/hooks'

interface PageProps {
  code: string
}
const Page = ({code}: PageProps) => {
  const MDXContent = useMDXComponent(code)

  return <MDXContent />
}

export default Page