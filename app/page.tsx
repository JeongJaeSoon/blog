import Image from 'next/image'
import { profile } from '@/content/profile'

export default function HomePage() {
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
