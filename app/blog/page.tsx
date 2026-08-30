import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getAllTags, formatDate } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on AI platforms, agent tooling, and shipping software.',
}

export default function BlogIndex() {
  const posts = getAllPosts()
  const tags = getAllTags()

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Writing</h1>

      {tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
          {tags.map((tag) => (
            <li key={tag.slug}>
              <Link
                href={`/blog/tag/${tag.slug}`}
                className="font-mono text-xs text-faint hover:text-accent"
              >
                #{tag.slug}
                <span className="ml-1 opacity-60">{tag.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <PostList posts={posts} />
    </div>
  )
}

export function PostList({ posts }: { posts: ReturnType<typeof getAllPosts> }) {
  if (posts.length === 0) {
    return <p className="mt-8 text-sm text-muted">No posts yet.</p>
  }

  return (
    <ul className="mt-10 space-y-8">
      {posts.map((post) => (
        <li key={post.slug}>
          <article>
            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="font-medium tracking-tight group-hover:text-accent">
                {post.title}
              </h2>
            </Link>
            <p className="mt-1 font-mono text-xs text-faint">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {' · '}
              {post.readingMinutes} min read
              {post.draft && ' · draft'}
            </p>
            {post.summary && (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {post.summary}
              </p>
            )}
          </article>
        </li>
      ))}
    </ul>
  )
}
