import { Metadata } from 'next'
import prisma from "../../../lib/prisma"
import KetoClient from './keto-client'

interface Props {
  params: { restaurant: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.restaurant },
  })

  return {
    title: `Keto Menu at ${restaurant?.name} - Low Carb Options Guide`,
    description: `Find all keto-friendly options at ${restaurant?.name}. Filter by net carbs, protein content, and allergens to find the perfect keto meal.`,
  }
}

export default async function KetoPage({ params }: Props) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.restaurant },
    include: {
      meals: {
        include: {
          category: {
            include: {
              parentCategory: true,
            },
          },
          variants: {
            include: {
              subvariants: true,
            },
          },
        },
      },
    },
  })

  const restaurants = await prisma.restaurant.findMany({
    orderBy: [{ rank: 'asc' }],
    take: 10,
  })

  const restaurantType = restaurant?.restaurantTypeSlug || ''

  return <KetoClient 
    restaurant={restaurant} 
    restaurants={restaurants}
    restaurantType={restaurantType}
  />
} 