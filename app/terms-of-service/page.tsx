import { Metadata } from 'next'
import TermsOfServiceClient from './terms-of-service-client'

export const metadata: Metadata = {
  title: 'Terms of Service | HealthyFastFood',
  description: 'Please read these Terms of Service carefully before using the website.',
  keywords: 'terms of service,healthyfastfood,terms',
  openGraph: {
    url: 'https://healthyfastfood.org/terms-of-service',
    type: 'website',
    title: 'Terms of Service | HealthyFastFood',
    description: 'Please read these Terms of Service carefully before using the website.',
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
    canonical: 'https://healthyfastfood.org/terms-of-service/',
  }
}

export default function TermsOfServicePage() {
  return <TermsOfServiceClient />
} 