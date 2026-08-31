import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import type { Dictionary } from '@/content/i18n'
import type { PostMeta } from '@/lib/posts'
import { formatDate } from '@/lib/format'

export function PostList({
  posts,
  lang,
  t,
}: {
  posts: PostMeta[]
  lang: Locale
  t: Dictionary
}) {
  if (posts.length === 0) {
    return <p className="mt-8 text-sm text-muted">{t.ui.noPosts}</p>
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {posts.map((post) => (
        <li key={post.slug} className="py-6">
          <article>
            <Link href={`/${lang}/blog/${post.slug}`} className="group">
              <h2 className="text-[1.05rem] font-medium tracking-tight group-hover:text-accent">
                {post.title}
              </h2>
            </Link>
            <p className="mt-1 font-mono text-xs text-faint">
              <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
              {' · '}
              {t.ui.readingTimePrefix}
              {post.readingMinutes}
              {t.ui.minRead}
              {post.draft && ` · ${t.ui.draft}`}
            </p>
            {post.summary && (
              <p className="mt-2 text-sm leading-relaxed text-muted">{post.summary}</p>
            )}
          </article>
        </li>
      ))}
    </ul>
  )
}
