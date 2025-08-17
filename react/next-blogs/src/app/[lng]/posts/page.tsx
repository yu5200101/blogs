import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'
import type { Post } from 'contentlayer/generated'
import { useTranslation } from '@/app/i18n'
import Like from './like';
import dayjs from "dayjs";

interface HomeProps {
  params: Promise<{lng: string}>
}

export const generateMetadata = async ({params}: HomeProps) => {
  const {lng} = await params
  const { t } = await useTranslation(lng, 'posts')
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: '博客列表',
      description: '这是博客列表页面'
    }
  }
}
interface PostCardProps extends Post{
  lng: string
}
function PostCard({lng, ...post}: PostCardProps) {
  return (
    <div className="mb-8">
      <h2 className="mb-1 text-xl">
        <Link href={`/${lng}${post.url}`} className="text-blue-700 hover:text-blue-900 dark:text-blue-400">
          {post.title}
        </Link>
      </h2>
      <time dateTime={post.date} className="mb-2 block text-xs text-gray-600">
        {dayjs(post.date).format('DD/MM/YYYY')}
      </time>
      <Like lng={lng} />
    </div>
  )
}
export default async function Home({params}: HomeProps) {
  const { lng } = await params
  const { t } = await useTranslation(lng)
  return (
    <div className="mx-auto max-w-xl py-8">
      <h1 className="mb-8 text-center text-2xl font-black">{t('blogList')}</h1>
      {allPosts.map((post, idx) => (
      <PostCard key={idx} lng={lng} {...post} />
    ))}
    </div>
  )
}