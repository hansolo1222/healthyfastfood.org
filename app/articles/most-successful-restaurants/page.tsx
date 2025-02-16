import { Metadata } from 'next'
import RestaurantArticleClient from './restaurant-article-client'

export const metadata: Metadata = {
  title: 'Comparing the 200 Most Successful Restaurant Chains in the US | HealthyFastFood',
  description: 'See how the most successful restaurants compare in terms of revenue per store and number of locations.',
  openGraph: {
    title: 'Comparing the 200 Most Successful Restaurant Chains in the US',
    description: 'Analysis of revenue per store, locations, and total revenue for top US restaurant chains',
    type: 'article',
    publishedTime: '2022-09-13',
  }
}

export default function RestaurantArticlePage() {
  return <RestaurantArticleClient />
} 