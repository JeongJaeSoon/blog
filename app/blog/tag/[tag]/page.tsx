import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllTags, getPostsByTag } from '@/lib/posts'
import { PostList } from '@/app/blog/page'

type Props = { params: Promise<{ tag: string }> }

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  return { title: `#${tag}`, description: `Posts tagged #${tag}.` }
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const posts = getPostsByTag(tag)
  if (posts.length === 0) notFound()

  return (
    <div>
      <Link href="/blog" className="font-mono text-xs text-faint hover:text-ink">
        ← All posts
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">#{tag}</h1>
      <PostList posts={posts} />
    </div>
  )
}
