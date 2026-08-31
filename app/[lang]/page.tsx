import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  codingStats,
  education,
  experience,
  identity,
  projects,
  publications,
  talks,
} from '@/content/profile'
import { getDictionary, type Dictionary } from '@/content/i18n'
import { isLocale, type Locale } from '@/lib/i18n'
import { getAllPosts, type PostMeta } from '@/lib/posts'
import { formatDate, month, period, publicationDate } from '@/lib/format'

type Props = { params: Promise<{ lang: string }> }

export default async function HomePage({ params }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)
  const posts = getAllPosts(lang).slice(0, 4)

  return (
    <div className="space-y-16">
      <Intro t={t} />
      <Experience lang={lang} t={t} />
      <Projects t={t} />
      <Skills t={t} />
      {talks.length > 0 && <Talks lang={lang} t={t} />}
      {publications.length > 0 && <Publications lang={lang} t={t} />}
      {education.length > 0 && <Education lang={lang} t={t} />}
      {codingStats.length > 0 && <CodingStats t={t} />}
      {posts.length > 0 && <LatestPosts lang={lang} t={t} posts={posts} />}
    </div>
  )
}

function Section({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <h2 className="shrink-0 font-mono text-xs uppercase tracking-[0.18em] text-muted">
          {title}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-line" />
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  )
}

function Intro({ t }: { t: Dictionary }) {
  return (
    <section className="print-avoid-break">
      <div className="flex items-start gap-4 sm:gap-5">
        <Image
          src={identity.avatar}
          alt=""
          width={72}
          height={72}
          priority
          className="rounded-full border border-line"
        />
        <div className="min-w-0 pt-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {identity.name}
            <span className="ml-2 text-base font-normal text-faint">
              ({identity.alias})
            </span>
          </h1>
          <p className="mt-1 text-[0.95rem] text-muted">
            {t.profile.headline} · {t.profile.org}
          </p>
          <p className="mt-0.5 font-mono text-xs text-faint">
            {t.profile.locationLine}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3.5 text-[0.95rem] leading-relaxed text-muted">
        {t.profile.about.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>

      <ul className="mt-6 flex flex-wrap gap-2">
        {identity.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="me noreferrer"
              className="inline-flex rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {link.label}
            </a>
            {link.handle && (
              <span className="ml-1.5 hidden font-mono text-xs text-faint print:inline">
                {link.handle}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Experience({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <Section title={t.sections.experience}>
      <div className="space-y-10">
        {experience.map((job) => {
          const text = t.experience[job.id]
          return (
            <article
              key={job.id}
              className="print-avoid-break border-b border-line pb-10 last:border-b-0 last:pb-0"
            >
              <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4">
                <h3 className="font-medium">
                  {job.href ? (
                    <a
                      href={job.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent"
                    >
                      {text?.company}
                    </a>
                  ) : (
                    text?.company
                  )}
                </h3>
                <span className="font-mono text-xs text-faint">
                  {period(job.start, job.end, lang, t.ui.present)}
                </span>
              </header>
              {text?.position && (
                <p className="mt-0.5 text-sm text-muted">{text.position}</p>
              )}
              <p className="mt-0.5 font-mono text-xs text-faint">
                {text?.location}
              </p>

              {job.roles && (
                <div className="mt-4 space-y-5 border-l border-line pl-5">
                  {job.roles.map((role) => {
                    const roleText = text?.roles?.[role.id]
                    if (!roleText) return null
                    return (
                      <div key={role.id}>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4">
                          <h4 className="text-sm font-medium">{roleText.title}</h4>
                          <span className="font-mono text-xs text-faint">
                            {period(role.start, role.end, lang, t.ui.present)}
                          </span>
                        </div>
                        {roleText.position && (
                          <p className="mt-0.5 text-sm text-muted">{roleText.position}</p>
                        )}
                        <p className="mt-1 text-sm text-muted">{roleText.summary}</p>
                        <ul className="mt-2 space-y-1 text-sm text-muted">
                          {roleText.highlights.map((highlight) => (
                            <li key={highlight} className="flex gap-2.5">
                              <span aria-hidden className="text-faint">
                                ·
                              </span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </Section>
  )
}

function Projects({ t }: { t: Dictionary }) {
  return (
    <Section
      title={t.sections.openSource}
      action={
        <a
          href={identity.repositories}
          target="_blank"
          rel="noreferrer"
          className="no-print text-xs text-faint hover:text-ink"
        >
          {t.ui.allRepositories} →
        </a>
      }
    >
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.id} className="print-avoid-break">
            <div className="flex flex-wrap items-baseline gap-x-2.5">
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm hover:text-accent"
              >
                {project.id}
              </a>
              {project.stars !== undefined && (
                <span className="font-mono text-xs text-faint">★ {project.stars}</span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">{t.projects[project.id]}</p>
            <p className="mt-1 font-mono text-xs text-faint">
              {project.stack.join(' · ')}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Talks({ lang, t }: { lang: Locale; t: Dictionary }) {
  const sorted = [...talks].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <Section
      title={t.sections.talks}
      action={
        <a
          href={identity.decks}
          target="_blank"
          rel="noreferrer"
          className="no-print text-xs text-faint hover:text-ink"
        >
          {t.ui.allDecks} →
        </a>
      }
    >
      <ul className="space-y-4">
        {sorted.map((item) => {
          const translated = t.talks[item.id]
          const showOriginal = item.lang !== lang && translated
          return (
            <li key={item.id} className="print-avoid-break">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-0 text-sm hover:text-accent"
                >
                  {translated || item.originalTitle}
                </a>
                <time
                  dateTime={item.date}
                  className="shrink-0 whitespace-nowrap font-mono text-xs text-faint"
                >
                  {publicationDate(item.date, lang)}
                </time>
              </div>
              {showOriginal && (
                <p className="mt-0.5 text-xs text-faint" lang={item.lang}>
                  {item.originalTitle}
                </p>
              )}
              <p className="mt-1 font-mono text-xs text-faint">{item.event}</p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

function Publications({ lang, t }: { lang: Locale; t: Dictionary }) {
  const sorted = [...publications].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <Section title={t.sections.publications}>
      <ul className="space-y-4">
        {sorted.map((item) => {
          const translated = t.publications[item.id]
          // Outside its own language, show the translation with the original
          // title underneath, so the reader can still match it to the source.
          const showOriginal = item.lang !== lang && translated
          return (
            <li key={item.id} className="print-avoid-break">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-0 text-sm hover:text-accent"
                >
                  {translated || item.id}
                </a>
                <time
                  dateTime={item.date}
                  className="shrink-0 whitespace-nowrap font-mono text-xs text-faint"
                >
                  {publicationDate(item.date, lang)}
                </time>
              </div>
              {showOriginal && (
                <p className="mt-0.5 text-xs text-faint" lang={item.lang}>
                  {item.originalTitle}
                </p>
              )}
              <p className="mt-1 font-mono text-xs text-faint">{item.outlet}</p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

function Skills({ t }: { t: Dictionary }) {
  return (
    <Section title={t.sections.skills}>
      <dl className="space-y-3">
        {t.skills.map((group) => (
          <div key={group.group} className="sm:flex sm:gap-6">
            <dt className="font-mono text-xs text-faint sm:w-32 sm:shrink-0 sm:pt-0.5">
              {group.group}
            </dt>
            <dd className="text-sm text-muted">{group.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

function Education({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <Section title={t.sections.education}>
      <ul className="space-y-3">
        {education.map((item) => {
          const text = t.education[item.id]
          if (!text) return null
          return (
            <li
              key={item.id}
              className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4"
            >
              <div>
                <p className="text-sm">{text.school}</p>
                {(text.degree || text.note) && (
                  <p className="mt-0.5 text-sm text-muted">
                    {[text.degree, text.note].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              <span className="font-mono text-xs text-faint">
                {item.start
                  ? period(item.start, item.end, lang, t.ui.present)
                  : item.end && month(item.end, lang)}
              </span>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

function CodingStats({ t }: { t: Dictionary }) {
  return (
    <Section title={t.sections.codingActivity}>
      <div className="space-y-4">
        {codingStats.map((chart) => (
          <figure key={chart.svg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={chart.svg}
              alt={chart.title}
              loading="lazy"
              className="w-full rounded-md border border-line"
            />
            <figcaption className="mt-1.5 font-mono text-xs text-faint">
              {chart.title} · WakaTime
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}

function LatestPosts({
  lang,
  t,
  posts,
}: {
  lang: Locale
  t: Dictionary
  posts: PostMeta[]
}) {
  return (
    <Section
      title={t.sections.writing}
      action={
        <Link
          href={`/${lang}/blog`}
          className="no-print text-xs text-faint hover:text-ink"
        >
          {t.ui.allPosts} →
        </Link>
      }
    >
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/${lang}/blog/${post.slug}`}
              className="group flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4"
            >
              <span className="min-w-0 text-sm group-hover:text-accent">
                {post.title}
              </span>
              <time
                dateTime={post.date}
                className="shrink-0 whitespace-nowrap font-mono text-xs text-faint"
              >
                {formatDate(post.date, lang)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
