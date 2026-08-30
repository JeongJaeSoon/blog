import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getAllTags } from '@/lib/posts'
import { getDictionary } from '@/content/i18n'
import { isLocale } from '@/lib/i18n'
import { PostList } from '@/components/PostList'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDictionary(lang)
  return {
    title: t.nav.blog,
    description: t.site.description,
    alternates: { canonical: `/${lang}/blog` },
  }
}

export default async function BlogIndex({ params }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)
  const posts = getAllPosts(lang)
  const tags = getAllTags(lang)

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{t.sections.writing}</h1>

      {tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
          {tags.map((tag) => (
            <li key={tag.slug}>
              <Link
                href={`/${lang}/blog/tag/${tag.slug}`}
                className="font-mono text-xs text-faint hover:text-accent"
              >
                #{tag.slug}
                <span className="ml-1 opacity-60">{tag.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <PostList posts={posts} lang={lang} t={t} />
    </div>
  )
}
