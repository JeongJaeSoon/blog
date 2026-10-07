import type { MetadataRoute } from 'next'
import { getAllTags, getPublishedPosts } from '@/lib/posts'
import { locales } from '@/lib/i18n'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((lang) => [
    { url: `${site.url}/${lang}` },
    { url: `${site.url}/${lang}/blog` },
    { url: `${site.url}/${lang}/work` },
    ...getPublishedPosts(lang).map((post) => ({
      url: `${site.url}/${lang}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
    ...getAllTags(lang, getPublishedPosts(lang)).map((tag) => ({
      url: `${site.url}/${lang}/blog/tag/${tag.slug}`,
    })),
  ])
}
