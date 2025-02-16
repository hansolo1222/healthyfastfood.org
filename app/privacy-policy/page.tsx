import { Metadata } from 'next'
import PrivacyPolicyClient from './privacy-policy-client'

export const metadata: Metadata = {
  title: 'Privacy Policy | HealthyFastFood',
  description: 'This page informs website visitors regarding our policies with the collection, use, and disclosure of Personal Information.',
  keywords: 'privacy policy,healthyfastfood,terms',
  openGraph: {
    url: 'https://healthyfastfood.org/privacy-policy',
    type: 'website',
    title: 'Privacy Policy | HealthyFastFood',
    description: 'This page informs website visitors regarding our policies with the collection, use, and disclosure of Personal Information.',
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
    canonical: 'https://healthyfastfood.org/privacy-policy/',
  }
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />
} 