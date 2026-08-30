/**
 * Who this site belongs to.
 *
 * Editing rule: only put things here that are verifiable from a public
 * source (GitHub, a talk, a published post) or that you are happy to show
 * a recruiter. Nothing internal, nothing about compensation.
 */

export type Link = {
  label: string
  href: string
  /** Shown next to the link when the page is printed. Keep it to a handle. */
  handle?: string
}

export const profile = {
  name: 'JaeSoon Jeong',
  /** Shown after the name, e.g. how people actually address you. */
  alias: 'jason',
  headline: 'Senior AI Platform Engineer',
  org: 'CAIO Office, freee K.K.',
  location: 'Tokyo, Japan',
  origin: 'Daegu, Korea',
  /** Two or three sentences. This is the first thing anyone reads. */
  about: [
    'I build the platform other engineers use to ship AI features safely — shared LLM runtime and gateway, authentication and supply-chain controls, and the governance that lets a whole company adopt AI tooling without each team reinventing it.',
    'Before that I spent two years on product delivery: receivables and invoicing at freee, where large-scale data, performance, and infrastructure migration were the everyday problems. That end-to-end delivery habit is what I carry into platform work — a feature is not done until it is operable.',
  ],
  avatar: '/avatar.jpg',
  links: [
    { label: 'GitHub', href: 'https://github.com/JeongJaeSoon', handle: '@JeongJaeSoon' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/JeongJaeSoon/', handle: '/in/JeongJaeSoon' },
    { label: 'X', href: 'https://x.com/dev_soon0_0', handle: '@dev_soon0_0' },
    { label: 'Threads', href: 'https://www.threads.com/@dev_soon.0_0', handle: '@dev_soon.0_0' },
    { label: 'Email', href: 'mailto:94jaesoon.jeong@gmail.com', handle: '94jaesoon.jeong@gmail.com' },
  ] satisfies Link[],
} as const
