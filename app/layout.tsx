import { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
    title: 'HealthyFastFood.org',
    description: 'Sort through a powerful database of 20,000+ menu items to find the healthiest items at restaurants.',
  }

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
  }: {
    children: React.ReactNode
  }) {
    
    return (
      <html lang="en">
        <body>{children}</body>
        <GoogleAnalytics gaId="G-PSTY3EB8KQ" />
        <Analytics />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4191723359468026"/>

      </html>
    )
  }