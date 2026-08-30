import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="py-16">
      <h1 className="font-mono text-sm text-faint">404</h1>
      <p className="mt-3 text-lg">This page does not exist.</p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm text-accent underline underline-offset-4 hover:no-underline"
      >
        Back home
      </Link>
    </div>
  )
}
