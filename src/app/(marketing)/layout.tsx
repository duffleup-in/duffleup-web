import { SiteNav } from '@/components/marketing/SiteNav'
import { Footer } from '@/components/marketing/Footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteNav />
      <main>{children}</main>
      <Footer />
    </>
  )
}
