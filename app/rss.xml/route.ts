import { getAllPosts } from '@/lib/posts'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

function escape(value: string) {
  return value.replace(/[<>&'"]/g, (char) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]!,
  )
}

export function GET() {
  const posts = getAllPosts()
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escape(post.title)}</title>
      <link>${site.url}/blog/${post.slug}</link>
      <guid isPermaLink="true">${site.url}/blog/${post.slug}</guid>
      <description>${escape(post.summary)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.title)}</title>
    <link>${site.url}</link>
    <description>${escape(site.description)}</description>
    <language>${site.locale}</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'content-type': 'application/rss+xml; charset=utf-8' },
  })
}
