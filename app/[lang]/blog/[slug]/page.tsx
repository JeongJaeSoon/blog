import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getPost, slugifyTag } from '@/lib/posts'
import { getDictionary } from '@/content/i18n'
import { locales, isLocale, localeTags } from '@/lib/i18n'
import { formatDate } from '@/lib/format'
import { site } from '@/lib/site'

type Props = { params: Promise<{ lang: string; slug: string }> }

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getAllPosts(lang).map((post) => ({ lang, slug: post.slug })),
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  const post = await getPost(slug)
  if (!post || !isLocale(lang)) return {}

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/${lang}/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      url: `${site.url}/${lang}/blog/${post.slug}`,
      locale: localeTags[lang].replace('-', '_'),
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { lang, slug } = await params
  if (!isLocale(lang)) notFound()
  const post = await getPost(slug)
  // A post only exists under the language it is written in.
  if (!post || post.lang !== lang) notFound()
  const t = getDictionary(lang)

  return (
    <article>
      <Link
        href={`/${lang}/blog`}
        className="no-print font-mono text-xs text-faint hover:text-ink"
      >
        ← {t.ui.allPosts}
      </Link>

      <header className="mt-6 border-b border-line pb-6">
        <h1 className="text-2xl font-semibold leading-snug tracking-tight">
          {post.title}
        </h1>
        <p className="mt-2 font-mono text-xs text-faint">
          <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
          {' · '}
          {t.ui.readingTimePrefix}
          {post.readingMinutes}
              {t.ui.minRead}
        </p>
        {post.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/${lang}/blog/tag/${slugifyTag(tag)}`}
                  className="font-mono text-xs text-faint hover:text-accent"
                >
                  #{slugifyTag(tag)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  )
}
