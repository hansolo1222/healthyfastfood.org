import { Metadata } from 'next'
import prisma from "../../lib/prisma"
import ExploreClient from './explore-client'

export const metadata: Metadata = {
  title: 'Explore All Menu Items | HealthyFastFood',
  description: 'Search and filter thousands of menu items across all restaurants. Find meals by calories, protein, dietary preferences and more.',
}

async function getData(searchParams: { [key: string]: string | string[] | undefined }) {
  const searchQuery = searchParams.q as string || '';
  const quickFilter = searchParams.quickFilter as string || '';
  
  // Get all restaurants for filter
  const restaurants = await prisma.restaurant.findMany({
    where: {
      meals: {
        some: {}
      }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: { meals: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  // Get all categories
  const categories = await prisma.category.findMany({
    include: {
      parentCategory: true,
      _count: {
        select: { meals: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  // Get initial meals (limited for performance)
  const meals = await prisma.meal.findMany({
    where: {
      published: true,
      ...(searchQuery && {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { restaurant: { name: { contains: searchQuery, mode: 'insensitive' } } },
          { categoryName: { contains: searchQuery, mode: 'insensitive' } }
        ]
      })
    },
    include: {
      restaurant: true,
      category: {
        include: {
          parentCategory: true
        }
      },
      variants: {
        include: {
          subvariants: true
        }
      }
    },
    take: 100, // Initial load limit
    orderBy: { name: 'asc' }
  });

  // Get aggregate stats for quick filters
  const stats = await prisma.meal.aggregate({
    _min: {
      calories: true,
      protein: true,
    },
    _max: {
      calories: true,
      protein: true,
    },
    _avg: {
      calories: true,
      protein: true,
    }
  });

  return {
    meals,
    restaurants,
    categories,
    stats,
    initialQuery: searchQuery,
    initialQuickFilter: quickFilter
  }
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const data = await getData(searchParams);
  
  return <ExploreClient {...data} />
} 