import { Metadata } from 'next'
import prisma from "../../lib/prisma"
import CategoryClient from './category-client'

export const metadata: Metadata = {
  title: 'Browse All Food Categories - HealthyFastFood',
  description: 'Explore fast food options by category. Find the healthiest options in burgers, salads, breakfast items, and more across all major restaurant chains.',
}

export default async function CategoryPage() {
  // Single query to get all data at once
  const categories = await prisma.category.findMany({
    include: {
      parentCategory: true,
      meals: {
        take: 5,
        orderBy: {
          calories: 'asc'
        },
        include: {
          restaurant: true,
          category: {
            include: {
              parentCategory: true
            }
          }
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  // Close the connection after the query
  await prisma.$disconnect()

  return <CategoryClient categories={categories} />
} 