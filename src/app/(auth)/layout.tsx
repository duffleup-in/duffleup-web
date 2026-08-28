import Link from 'next/link'
import type { ReactNode } from 'react'

// Centered, card-style shell shared by all auth screens.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sterling-warm px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="font-display text-3xl uppercase tracking-[0.08em] text-pitch no-underline"
          >
            duffleup
          </Link>
        </div>
        <div className="rounded-md border-2 border-line-strong bg-white p-6">{children}</div>
      </div>
    </main>
  )
}
