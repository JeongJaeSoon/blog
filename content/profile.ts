/**
 * Locale-invariant facts: dates, URLs, repository names, tech stacks, star counts.
 *
 * Anything translatable — job titles, summaries, descriptions, skills — lives
 * in `content/i18n/<locale>.ts`, keyed by the `id` fields declared here. That
 * way a date or a repository name is stored exactly once and cannot drift
 * between languages.
 *
 * Editing rule: only put things here that are verifiable from a public source
 * (GitHub, a talk, a published post) or that you are happy to show a recruiter.
 * Nothing internal, nothing about compensation.
 */

export type Link = {
  label: string
  href: string
  /** Shown next to the link when the page is printed. Keep it to a handle. */
  handle?: string
}

export type Role = {
  /** Key into `dictionary.experience[jobId].roles`. */
  id: string
  /** `YYYY-MM`. Omit `end` for the current role. */
  start: string
  end?: string
}

export type Job = {
  /** Key into `dictionary.experience` — the display name lives there. */
  id: string
  href?: string
  start: string
  end?: string
  roles?: Role[]
}

export type Project = {
  /** Key into `dictionary.projects`. Also the displayed repository name. */
  id: string
  href: string
  stack: string[]
  /** GitHub stars, refreshed by hand. Omit rather than guess. */
  stars?: number
}

export type Education = {
  /** Key into `dictionary.education`. */
  id: string
  start: string
  end?: string
}

export const identity = {
  name: 'JaeSoon Jeong',
  /** Shown after the name, e.g. how people actually address you. */
  alias: 'jason',
  avatar: '/avatar.jpg',
  links: [
    { label: 'GitHub', href: 'https://github.com/JeongJaeSoon', handle: '@JeongJaeSoon' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/JeongJaeSoon/', handle: '/in/JeongJaeSoon' },
    { label: 'X', href: 'https://x.com/dev_soon0_0', handle: '@dev_soon0_0' },
    { label: 'Threads', href: 'https://www.threads.com/@dev_soon.0_0', handle: '@dev_soon.0_0' },
    { label: 'Email', href: 'mailto:94jaesoon.jeong@gmail.com', handle: '94jaesoon.jeong@gmail.com' },
  ] satisfies Link[],
  /** Repository listing linked from the open-source section. */
  repositories: 'https://github.com/JeongJaeSoon?tab=repositories',
} as const

export const experience: Job[] = [
  {
    id: 'freee',
    href: 'https://corp.freee.co.jp/',
    start: '2023-11',
    roles: [
      { id: 'ai-platform', start: '2026-01' },
      { id: 'ai-driven-dev', start: '2025-07', end: '2025-12' },
      { id: 'invoicing', start: '2023-11', end: '2025-06' },
    ],
  },
  {
    id: 'lifull',
    href: 'https://lifull.com/',
    start: '2022-04',
    end: '2023-10',
  },
]

export const education: Education[] = [{ id: 'koreacu', start: '2026-03' }]

/** Public repositories worth showing. Star counts are refreshed by hand. */
export const projects: Project[] = [
  {
    id: 'agent-guard',
    href: 'https://github.com/JeongJaeSoon/agent-guard',
    stack: ['Shell', 'gitleaks', 'GitHub Actions'],
    stars: 24,
  },
  {
    id: 'kollegium',
    href: 'https://github.com/JeongJaeSoon/kollegium',
    stack: ['TypeScript', 'Slack'],
  },
  {
    id: 'terraform-provider-claude-enterprise',
    href: 'https://github.com/JeongJaeSoon/terraform-provider-claude-enterprise',
    stack: ['Go', 'Terraform'],
  },
  {
    id: 'relay',
    href: 'https://github.com/JeongJaeSoon/relay',
    stack: ['TypeScript'],
  },
  {
    id: 'mux',
    href: 'https://github.com/JeongJaeSoon/mux',
    stack: ['Go'],
  },
]

/**
 * WakaTime coding stats.
 *
 * The dashboard itself is private, so nothing is rendered until you paste in
 * a *share* embed. Create one at wakatime.com → Settings → Embeddable Charts,
 * then drop the `.svg` URLs here. Leave the array empty to hide the section.
 */
export const codingStats: { title: string; svg: string }[] = [
  // { title: 'Languages · last 30 days', svg: 'https://wakatime.com/share/@you/xxxx.svg' },
]
