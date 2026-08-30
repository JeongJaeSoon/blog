import Image from 'next/image'
import Link from 'next/link'
import {
  codingStats,
  education,
  experience,
  profile,
  projects,
  skills,
} from '@/content/profile'
import { getAllPosts, formatDate } from '@/lib/posts'
import { period } from '@/lib/format'

export default function HomePage() {
  const posts = getAllPosts().slice(0, 4)

  return (
    <div className="space-y-14">
      <Intro />
      <Experience />
      <Projects />
      <Skills />
      {education.length > 0 && <Education />}
      {codingStats.length > 0 && <CodingStats />}
      {posts.length > 0 && <LatestPosts posts={posts} />}
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
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function Intro() {
  return (
    <section className="print-avoid-break">
      <div className="flex items-start gap-5">
        <Image
          src={profile.avatar}
          alt=""
          width={72}
          height={72}
          priority
          className="rounded-full border border-line"
        />
        <div className="min-w-0 pt-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {profile.name}
            <span className="ml-2 text-base font-normal text-faint">
              ({profile.alias})
            </span>
          </h1>
          <p className="mt-1 text-[0.95rem] text-muted">
            {profile.headline} · {profile.org}
          </p>
          <p className="mt-0.5 font-mono text-xs text-faint">
            {profile.location} — from {profile.origin}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3.5 text-[0.95rem] leading-relaxed text-muted">
        {profile.about.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {profile.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="me noreferrer"
              className="text-accent underline decoration-1 underline-offset-4 hover:no-underline"
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

function Experience() {
  return (
    <Section title="Experience">
      <div className="space-y-9">
        {experience.map((job) => (
          <article key={job.company} className="print-avoid-break">
            <header className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-medium">
                {job.href ? (
                  <a
                    href={job.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent"
                  >
                    {job.company}
                  </a>
                ) : (
                  job.company
                )}
              </h3>
              <span className="font-mono text-xs text-faint">
                {period(job.start, job.end)}
              </span>
            </header>
            {job.position && (
              <p className="mt-0.5 text-sm text-muted">{job.position}</p>
            )}
            <p className="mt-0.5 font-mono text-xs text-faint">{job.location}</p>

            {job.roles && (
              <div className="mt-4 space-y-5 border-l border-line pl-5">
                {job.roles.map((role) => (
                  <div key={role.title}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h4 className="text-sm font-medium">{role.title}</h4>
                      <span className="font-mono text-xs text-faint">
                        {period(role.start, role.end)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{role.summary}</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted">
                      {role.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-2.5">
                          <span aria-hidden className="text-faint">
                            ·
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </Section>
  )
}

function Projects() {
  return (
    <Section
      title="Open source"
      action={
        <a
          href="https://github.com/JeongJaeSoon?tab=repositories"
          target="_blank"
          rel="noreferrer"
          className="no-print text-xs text-faint hover:text-ink"
        >
          All repositories →
        </a>
      }
    >
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.name} className="print-avoid-break">
            <div className="flex flex-wrap items-baseline gap-x-2.5">
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm hover:text-accent"
              >
                {project.name}
              </a>
              {project.stars !== undefined && (
                <span className="font-mono text-xs text-faint">
                  ★ {project.stars}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">{project.description}</p>
            <p className="mt-1 font-mono text-xs text-faint">
              {project.stack.join(' · ')}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Skills() {
  return (
    <Section title="Skills">
      <dl className="space-y-3">
        {skills.map((group) => (
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

function Education() {
  return (
    <Section title="Education">
      <ul className="space-y-3">
        {education.map((item) => (
          <li
            key={item.school}
            className="flex flex-wrap items-baseline justify-between gap-x-4"
          >
            <div>
              <p className="text-sm">{item.school}</p>
              {(item.degree || item.note) && (
                <p className="mt-0.5 text-sm text-muted">
                  {[item.degree, item.note].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
            <span className="font-mono text-xs text-faint">
              {period(item.start)}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function CodingStats() {
  return (
    <Section title="Coding activity">
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

function LatestPosts({ posts }: { posts: ReturnType<typeof getAllPosts> }) {
  return (
    <Section
      title="Writing"
      action={
        <Link href="/blog" className="no-print text-xs text-faint hover:text-ink">
          All posts →
        </Link>
      }
    >
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-wrap items-baseline justify-between gap-x-4"
            >
              <span className="text-sm group-hover:text-accent">{post.title}</span>
              <time
                dateTime={post.date}
                className="font-mono text-xs text-faint"
              >
                {formatDate(post.date)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
