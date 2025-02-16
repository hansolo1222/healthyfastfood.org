import { Metadata } from 'next'
import DonateClient from './donate-client'

export const metadata: Metadata = {
  title: 'Donate | HealthyFastFood',
  description: 'Support the development of HealthyFastFood.org',
  keywords: 'donate,healthyfastfood,support',
  openGraph: {
    url: 'https://healthyfastfood.org/donate',
    type: 'website',
    title: 'Donate | HealthyFastFood',
    description: 'Support the development of HealthyFastFood.org',
    images: [
      {
        url: '/images/restaurant_logos/mcdonalds.webp',
        width: 400,
        height: 400,
        alt: 'Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@healthyfastfood',
  },
  alternates: {
    canonical: 'https://healthyfastfood.org/donate/',
  }
}

export default function DonatePage() {
  return <DonateClient />
} 