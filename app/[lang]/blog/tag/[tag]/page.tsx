import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllTags, getPostsByTag } from '@/lib/posts'
import { getDictionary } from '@/content/i18n'
import { locales, isLocale } from '@/lib/i18n'
import { PostList } from '@/components/PostList'

type Props = { params: Promise<{ lang: string; tag: string }> }

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getAllTags(lang).map((tag) => ({ lang, tag: tag.slug })),
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, tag } = await params
  return { title: `#${tag}`, alternates: { canonical: `/${lang}/blog/tag/${tag}` } }
}

export default async function TagPage({ params }: Props) {
  const { lang, tag } = await params
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)
  const posts = getPostsByTag(tag, lang)
  if (posts.length === 0) notFound()

  return (
    <div>
      <Link
        href={`/${lang}/blog`}
        className="font-mono text-xs text-faint hover:text-ink"
      >
        ← {t.ui.allPosts}
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">#{tag}</h1>
      <PostList posts={posts} lang={lang} t={t} />
    </div>
  )
}
