import { allPosts } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import type { AllPost } from '@/app/[lng]/posts/type'

export default function sitemap() {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allPosts
    .map((post) => {
      const postData = post as AllPost
      return {
        url: `${siteUrl}${postData.url}`,
        lastModified: postData.lastmod || postData.date
      }
    })

  const routes = ['', 'posts'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}