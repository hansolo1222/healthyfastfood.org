import { Metadata } from 'next'
import prisma from "../lib/prisma"
import HomeClient from './home-client'
import { createClient } from '../utils/supabase/server'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'HealthyFastFood - Compare Fast Food Nutrition Facts Across Restaurants',
  description: 'Find the healthiest options at every major restaurant chain. Compare nutrition facts, filter by diet type, and discover high-protein, low-carb alternatives.',
}

export default async function HomePage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // const { data: { user } } = await supabase.auth.getUser()

  // Get existing data for HomeClient
  const restaurants = await prisma.restaurant.findMany({
    orderBy: [{ rank: 'asc' }],
  })

  const parentCategories = await prisma.parentCategory.findMany()

  const topProteinMeals = await prisma.meal.findMany({
    take: 10,
    orderBy: {
      protein: 'desc'
    }
  })

  await prisma.$disconnect()

  return <HomeClient 
    restaurants={restaurants}
    parentCategories={parentCategories}
    topProteinMeals={topProteinMeals}
    // user={user}
  />
} 