import { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from "@vercel/analytics/react"
import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { plusJakartaSans } from '../lib/fonts';

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
      <html lang="en" className=" ">
        <body  className={plusJakartaSans.className}>
          <Header />
          <div className="layout md:px-6 lg:px-7 pb-20   ">{children}</div>
          <Footer />
          <GoogleAnalytics gaId="G-PSTY3EB8KQ" />
          <Analytics />
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4191723359468026"/>
        </body>
      </html>
    )
  }