import { MetadataRoute } from 'next'
import prisma from '../lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://healthyfastfood.org'

  // Get data from your database
  const restaurants = await prisma.restaurant.findMany()
  const categories = await prisma.restaurantType.findMany()
  const meals = await prisma.meal.findMany({
    include: {
      restaurant: true,
    },
  })

  // Static routes
  const staticRoutes = [
    '',
    '/category',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  // Restaurant routes
  const restaurantRoutes = restaurants.map((restaurant) => ({
    url: `${baseUrl}/${restaurant.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Keto routes
  const ketoRoutes = restaurants.map((restaurant) => ({
    url: `${baseUrl}/${restaurant.slug}/keto`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Low carb routes
  const lowCarbRoutes = restaurants.map((restaurant) => ({
    url: `${baseUrl}/${restaurant.slug}/low-carb`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Category routes
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
 

  return [
    ...staticRoutes,
    ...restaurantRoutes,
    ...categoryRoutes,
    ...ketoRoutes,
    ...lowCarbRoutes, 
  ]
}