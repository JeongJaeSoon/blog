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
import { isLocale, locales, type Locale } from './i18n'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

export type PostMeta = {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  draft: boolean
  lang: Locale
  readingMinutes: number
}

export type Post = PostMeta & { html: string }

type PostSource = {
  slug: string
  lang: Locale
  file: string
}

/**
 * One directory is one article. Every article must provide en.md, ko.md and
 * ja.md so locale switching never points at a missing rendition.
 */
function getPostSources(): PostSource[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true })
  const looseMarkdown = entries.find(
    (entry) => entry.isFile() && entry.name.endsWith('.md'),
  )
  if (looseMarkdown) {
    throw new Error(
      `Move "content/posts/${looseMarkdown.name}" into content/posts/<slug>/<lang>.md`,
    )
  }

  return entries
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) =>
      locales.map((lang) => {
        const file = path.join(POSTS_DIR, entry.name, `${lang}.md`)
        if (!fs.existsSync(file)) {
          throw new Error(`Post "${entry.name}" is missing ${lang}.md`)
        }
        return { slug: entry.name, lang, file }
      }),
    )
}

function read(source: PostSource) {
  return matter(fs.readFileSync(source.file, 'utf8'))
}

function toMeta(
  source: PostSource,
  data: Record<string, unknown>,
  body: string,
): PostMeta {
  const words = body.trim().split(/\s+/).length
  const declaredLang = String(data.lang ?? source.lang)
  if (!isLocale(declaredLang) || declaredLang !== source.lang) {
    throw new Error(
      `Post "${source.slug}/${source.lang}.md" must declare lang: ${source.lang}`,
    )
  }

  return {
    slug: source.slug,
    title: String(data.title ?? source.slug),
    date: String(data.date ?? ''),
    summary: String(data.summary ?? ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    lang: source.lang,
    readingMinutes: Math.max(1, Math.round(words / 220)),
  }
}

function loadMeta(source: PostSource): PostMeta {
  const parsed = read(source)
  return toMeta(source, parsed.data, parsed.content)
}

function getValidatedPostMeta(): PostMeta[] {
  const posts = getPostSources().map(loadMeta)
  for (const slug of new Set(posts.map((post) => post.slug))) {
    const renditions = posts.filter((post) => post.slug === slug)
    if (new Set(renditions.map((post) => post.date)).size !== 1) {
      throw new Error(`Post "${slug}" must use the same date in every language`)
    }
    if (new Set(renditions.map((post) => post.draft)).size !== 1) {
      throw new Error(`Post "${slug}" must use the same draft state in every language`)
    }
  }
  return posts
}

/** Drafts stay out of the build; they are visible in `next dev`. */
function isVisible(post: PostMeta) {
  return !post.draft || process.env.NODE_ENV === 'development'
}

/** Newest first. Pass a locale to get only that rendition of every post. */
export function getAllPosts(locale?: Locale): PostMeta[] {
  return getValidatedPostMeta()
    .filter((post) => !locale || post.lang === locale)
    .filter(isVisible)
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

export function getPostAlternates(slug: string): PostMeta[] {
  return getAllPosts().filter((post) => post.slug === slug)
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

export async function getPost(slug: string, lang: Locale): Promise<Post | null> {
  const source = getPostSources().find(
    (candidate) => candidate.slug === slug && candidate.lang === lang,
  )
  if (!source) return null

  const meta = getValidatedPostMeta().find(
    (candidate) => candidate.slug === slug && candidate.lang === lang,
  )!
  const parsed = read(source)
  if (!isVisible(meta)) return null
  const html = String(await processor.process(parsed.content))
  return { ...meta, html }
}
