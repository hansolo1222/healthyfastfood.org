import { Metadata } from 'next'
import prisma from "../../lib/prisma"
import RestaurantsClient from './restaurants-client'

export const metadata: Metadata = {
  title: 'All Restaurants | HealthyFastFood',
  description: 'Compare nutrition facts across all major restaurant chains',
}

 async function getData() {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: [{ rank: 'desc' }],
    include: {
      segment: true,
      restaurantTypes: true,
      _count: {
        select: { meals: true },
      },
    },
  })

  const restaurantTypes = await prisma.restaurantType.findMany()

  return {
    restaurants: restaurants.map(r => ({ 
      ...r, 
      itemCount: r._count.meals,
      restaurantTypesNames: r.restaurantTypes.map(type => type.name)
    })),
    restaurantTypes,
  }
}

export default async function RestaurantsPage() {
  const data = await getData()
  
  return <RestaurantsClient {...data} />
} 