import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getPost, formatDate } from '@/lib/posts'
import { slugifyTag } from '@/lib/posts'
import { site } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `${site.url}/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      url: `${site.url}/blog/${post.slug}`,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <article>
      <Link href="/blog" className="no-print font-mono text-xs text-faint hover:text-ink">
        ← All posts
      </Link>

      <header className="mt-6 border-b border-line pb-6">
        <h1 className="text-2xl font-semibold leading-snug tracking-tight">
          {post.title}
        </h1>
        <p className="mt-2 font-mono text-xs text-faint">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {' · '}
          {post.readingMinutes} min read
        </p>
        {post.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/blog/tag/${slugifyTag(tag)}`}
                  className="font-mono text-xs text-faint hover:text-accent"
                >
                  #{slugifyTag(tag)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>

      <div
        className="prose mt-8"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  )
}
