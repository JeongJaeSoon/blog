import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import { defaultLocale, isLocale, type Locale } from './i18n'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

export type PostMeta = {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  draft: boolean
  /** Language the post is written in. Defaults to the site default. */
  lang: Locale
  readingMinutes: number
}

export type Post = PostMeta & { html: string }

function read(slug: string) {
  const file = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(file)) return null
  return matter(fs.readFileSync(file, 'utf8'))
}

function toMeta(slug: string, data: Record<string, unknown>, body: string): PostMeta {
  const words = body.trim().split(/\s+/).length
  const lang = String(data.lang ?? defaultLocale)
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ''),
    summary: String(data.summary ?? ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    lang: isLocale(lang) ? lang : defaultLocale,
    readingMinutes: Math.max(1, Math.round(words / 220)),
  }
}

/** Drafts stay out of the build; they are visible in `next dev`. */
function isVisible(post: PostMeta) {
  return !post.draft || process.env.NODE_ENV === 'development'
}

/** Newest first. Pass a locale to get only posts written in that language. */
export function getAllPosts(locale?: Locale): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const slug = name.replace(/\.md$/, '')
      const parsed = read(slug)!
      return toMeta(slug, parsed.data, parsed.content)
    })
    .filter(isVisible)
    .filter((post) => !locale || post.lang === locale)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPostsByTag(tag: string, locale: Locale): PostMeta[] {
  return getAllPosts(locale).filter((post) =>
    post.tags.some((t) => slugifyTag(t) === tag),
  )
}

export function getAllTags(locale: Locale): { tag: string; slug: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of getAllPosts(locale)) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, slug: slugifyTag(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function slugifyTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-')
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
  .use(rehypeShiki, {
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  })
  .use(rehypeStringify)

export async function getPost(slug: string): Promise<Post | null> {
  const parsed = read(slug)
  if (!parsed) return null
  const meta = toMeta(slug, parsed.data, parsed.content)
  if (!isVisible(meta)) return null
  const html = String(await processor.process(parsed.content))
  return { ...meta, html }
}
