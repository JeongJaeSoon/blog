import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { identity } from '@/content/profile'
import { work, workContact } from '@/content/work'
import { isLocale, locales, localeTags } from '@/lib/i18n'
import { site } from '@/lib/site'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = work[lang]
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `/${lang}/work`,
      languages: Object.fromEntries(locales.map((l) => [localeTags[l], `/${l}/work`])),
    },
    openGraph: {
      type: 'website',
      siteName: identity.name,
      title: t.title,
      description: t.description,
      url: `${site.url}/${lang}/work`,
      locale: localeTags[lang].replace('-', '_'),
    },
  }
}

export default async function WorkPage({ params }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = work[lang]
  return (
    <div className="space-y-12">
      <header className="max-w-2xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-faint">94soon · {identity.name}</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.title}</h1>
        <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">{t.intro}</p>
      </header>
      <section aria-labelledby="areas">
        <h2 id="areas" className="mb-6 border-b border-line pb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted">{t.areasTitle}</h2>
        <div className="grid gap-7 sm:grid-cols-2 sm:gap-8">
          {t.areas.map((area) => (
            <article key={area.title} className="print-avoid-break">
              <h3 className="font-medium">{area.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{area.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="max-w-2xl">
        <h2 className="font-medium">{t.approachTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t.approach}</p>
      </section>
      <section className="max-w-2xl">
        <h2 className="font-medium">{t.openSourceTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t.openSource}</p>
        <a href={identity.repositories} className="mt-4 inline-block text-sm text-accent underline underline-offset-4">{t.repositories} →</a>
      </section>
      <section className="border-t border-line pt-8">
        <h2 className="font-medium">{t.contactTitle}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{t.contact}</p>
        <a href={`mailto:${workContact}`} className="mt-4 inline-block font-mono text-sm text-accent underline underline-offset-4">{workContact}</a>
      </section>
    </div>
  )
}
