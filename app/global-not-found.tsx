import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { defaultLocale } from '@/lib/i18n'
import { getDictionary } from '@/content/i18n'
import './globals.css'

const sans = Inter({ subsets: ['latin'], variable: '--font-sans-stack', display: 'swap' })

export const metadata: Metadata = { title: '404' }

export default function GlobalNotFound() {
  const t = getDictionary(defaultLocale)

  return (
    <html lang="en" className={sans.variable}>
      <body className="min-h-dvh">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="font-mono text-sm text-faint">404</h1>
          <p className="mt-3 text-lg">{t.ui.notFoundTitle}</p>
          <a
            href={`/${defaultLocale}`}
            className="mt-6 inline-block text-sm text-accent underline underline-offset-4 hover:no-underline"
          >
            {t.ui.backHome}
          </a>
        </div>
      </body>
    </html>
  )
}
