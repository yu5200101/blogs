import type { Post } from 'contentlayer/generated'

export interface AllPost extends Post {
  lastmod: string
  images: string | string[]
  authors: string
  description: string
}