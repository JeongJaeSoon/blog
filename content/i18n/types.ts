/**
 * The translation contract.
 *
 * Every locale file implements `Dictionary` exactly, so a missing or renamed
 * key fails `bun run build` rather than rendering a blank. Only *translatable
 * prose* lives here — dates, URLs, repository names, tech stacks and star counts
 * stay in `content/profile.ts` so a fact is never stored three times.
 *
 * The `Record` keys below are the ids declared in `content/profile.ts`.
 */

export type RoleText = {
  title: string
  summary: string
  highlights: string[]
}

export type JobText = {
  /**
   * Company name as it should read in this language — legal forms differ
   * (`freee K.K.` / `freee株式会社`, `LIFULL Co., Ltd.` / `株式会社LIFULL`).
   */
  company: string
  /** Résumé job title. Empty string hides the line. */
  position: string
  /** Where the job was, translated — e.g. "Tokyo, Japan" / "도쿄, 일본". */
  location: string
  roles?: Record<string, RoleText>
}

export type EducationText = {
  school: string
  /** Empty string hides it. */
  degree: string
  note: string
}

export type SkillGroup = {
  group: string
  items: string[]
}

export type Dictionary = {
  site: {
    title: string
    description: string
  }
  nav: {
    about: string
    blog: string
  }
  sections: {
    experience: string
    openSource: string
    skills: string
    education: string
    writing: string
    codingActivity: string
  }
  ui: {
    allPosts: string
    allRepositories: string
    /**
     * Rendered as `{readingTimePrefix}{n}{minRead}` with no added spacing, so
     * each language controls its own: English needs a leading space
     * (`5 min read`), Korean and Japanese do not (`5분 읽기`, `約5分`).
     */
    minRead: string
    readingTimePrefix: string
    noPosts: string
    backHome: string
    notFoundTitle: string
    draft: string
    language: string
    present: string
  }
  profile: {
    headline: string
    org: string
    /**
     * Where you are and where you are from, as one line. Deliberately not
     * assembled from parts: "Tokyo — from Daegu" only works in English word
     * order, while Korean and Japanese put the origin before the marker.
     */
    locationLine: string
    about: string[]
  }
  experience: Record<string, JobText>
  /** Project id → one-line description. */
  projects: Record<string, string>
  education: Record<string, EducationText>
  skills: SkillGroup[]
}
