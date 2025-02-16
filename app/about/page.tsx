import { Metadata } from 'next'
import AboutClient from './about-client'

export const metadata: Metadata = {
  title: 'About | HealthyFastFood',
  description: 'HealthyFastFood is the definitive source on restaurant nutrition.',
  keywords: 'healthyfastfood,nutrition,about',
  openGraph: {
    url: 'https://healthyfastfood.org/about',
    type: 'website',
    title: 'About | HealthyFastFood',
    description: 'HealthyFastFood is the definitive source on the healthiest items to order at restaurants',
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
    canonical: 'https://healthyfastfood.org/about/',
  }
}

export default function AboutPage() {
  return <AboutClient />
} 