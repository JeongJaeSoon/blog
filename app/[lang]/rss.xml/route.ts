import { getAllPosts } from '@/lib/posts'
import { getDictionary } from '@/content/i18n'
import { locales, isLocale, localeTags } from '@/lib/i18n'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

function escape(value: string) {
  return value.replace(/[<>&'"]/g, (char) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]!,
  )
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string }> },
) {
  const { lang } = await params
  if (!isLocale(lang)) return new Response('Not found', { status: 404 })

  const t = getDictionary(lang)
  const items = getAllPosts(lang)
    .map(
      (post) => `    <item>
      <title>${escape(post.title)}</title>
      <link>${site.url}/${lang}/blog/${post.slug}</link>
      <guid isPermaLink="true">${site.url}/${lang}/blog/${post.slug}</guid>
      <description>${escape(post.summary)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(t.site.title)}</title>
    <link>${site.url}/${lang}</link>
    <description>${escape(t.site.description)}</description>
    <language>${localeTags[lang]}</language>
    <atom:link href="${site.url}/${lang}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'content-type': 'application/rss+xml; charset=utf-8' },
  })
}
