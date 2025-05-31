import { Metadata } from 'next'
import prisma from "../lib/prisma"
import HomeClient from './home-client'

export const metadata: Metadata = {
  title: 'HealthyFastFood - Find Healthy Options at Every Restaurant',
  description: 'Compare nutrition facts across 100+ restaurant chains. Filter by calories, protein, carbs, and allergens. Find keto, low-carb, and high-protein meals instantly.',
  keywords: 'fast food nutrition, healthy fast food, restaurant calories, protein meals, keto fast food',
  openGraph: {
    title: 'HealthyFastFood - Smart Fast Food Choices',
    description: 'The most comprehensive nutrition database for restaurant meals',
    images: ['/og-image.jpg'],
  }
}

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  // Parallel data fetching for better performance
  const [
    restaurants,
    categories,
    stats,
    popularHealthyMeals,
    recentSearches
  ] = await Promise.all([
    // Top restaurants - ONLY those with meals
    prisma.restaurant.findMany({
      where: {
        meals: {
          some: {} // Only restaurants that have at least one meal
        }
      },
      orderBy: [{ locations: 'desc' }],
      take: 12,
      include: {
        _count: { select: { meals: true } }
      }
    }),

    // Categories with meal counts
    prisma.category.findMany({
      include: {
        _count: { select: { meals: true } },
        parentCategory: true
      },
      take: 8,
      orderBy: { meals: { _count: 'desc' } }
    }),

    // Platform statistics
    Promise.all([
      prisma.meal.count(),
      prisma.restaurant.count(),
      prisma.meal.findMany({
        where: { calories: { lt: 500 } },
        select: { id: true }
      }).then(meals => meals.length),
      prisma.meal.findMany({
        where: { protein: { gte: 30 } },
        select: { id: true }
      }).then(meals => meals.length)
    ]).then(([totalMeals, totalRestaurants, lowCalMeals, highProteinMeals]) => ({
      totalMeals,
      totalRestaurants,
      lowCalorieMeals: lowCalMeals,
      highProteinMeals
    })),

    // Popular healthy options
    prisma.meal.findMany({
      where: {
        AND: [
          { calories: { lte: 600 } },
          { protein: { gte: 25 } }
        ]
      },
      take: 6,
      orderBy: [
        { proteinPerCalorie: 'desc' }
      ],
      include: {
        restaurant: true,
        category: true
      }
    }),

    // Mock recent searches (in real app, track actual searches)
    Promise.resolve([
      "McDonald's salads",
      "Subway low carb",
      "Chipotle keto bowl",
      "Wendy's high protein"
    ])
  ])

  return <HomeClient 
    restaurants={restaurants}
    categories={categories}
    stats={stats}
    popularHealthyMeals={popularHealthyMeals}
    recentSearches={recentSearches}
  />
} 