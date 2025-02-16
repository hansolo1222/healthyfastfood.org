import { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from "@vercel/analytics/react"
import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { plusJakartaSans } from '../lib/fonts';

export const metadata: Metadata = {
    title: 'HealthyFastFood',
    description: 'Find the healthiest options at every major restaurant chain.',
    icons: {
        icon: [
            { url: '/icon.png' },
            { url: '/icon-dark.png', media: '(prefers-color-scheme: dark)' },
        ],
        apple: [
            { url: '/apple-icon.png' },
            { url: '/apple-icon-dark.png', media: '(prefers-color-scheme: dark)' },
        ],
        shortcut: '/shortcut-icon.png',
        other: [
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/apple-touch-icon-precomposed.png',
            },
        ],
    },
}

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
  }: {
    children: React.ReactNode
  }) {
    
    return (
      <html lang="en" className=" ">
        <body  className={plusJakartaSans.className}>
          <Navbar />
          <div className="layout md:px-6 lg:pl-7 lg:pr-4 pb-20   ">{children}</div>
          <Footer />
          <GoogleAnalytics gaId="G-PSTY3EB8KQ" />
          <Analytics />
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4191723359468026"/>
        </body>
      </html>
    )
  }