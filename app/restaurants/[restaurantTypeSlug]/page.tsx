import { Metadata } from 'next'
import prisma from "../../../lib/prisma"
import RestaurantTypeClient from './restaurant-type-client'

type Props = {
  params: { restaurantTypeSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const type = await prisma.restaurantType.findUnique({
    where: { slug: params.restaurantTypeSlug },
  })

  return {
    title: `${type?.name} Restaurants | HealthyFastFood`,
    description: type?.description,
  }
}

async function getData(slug: string) {
  const type = await prisma.restaurantType.findUnique({
    where: { slug },
    include: {
      restaurants: true
    }
  })

  const restaurantTypes = await prisma.restaurantType.findMany()

  return {
    type,
    restaurantTypes
  }
}

export default async function RestaurantTypePage({ params }: Props) {
  const data = await getData(params.restaurantTypeSlug)
  
  if (!data.type) return null
  
  return <RestaurantTypeClient {...data} />
} 