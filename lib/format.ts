const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/** `2023-11` → `Nov 2023`. */
export function month(value: string): string {
  const [year, m] = value.split('-')
  const index = Number(m) - 1
  return MONTHS[index] ? `${MONTHS[index]} ${year}` : year
}

/** `2023-11` + undefined → `Nov 2023 — Present`. */
export function period(start: string, end?: string): string {
  return `${month(start)} — ${end ? month(end) : 'Present'}`
}
