import { Metadata } from 'next'
import prisma from "../../../lib/prisma"
import CategorySlugClient from './category-slug-client'

interface Props {
  params: { categorySlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.categorySlug },
  })

  return {
    title: `${category?.name} Nutrition Facts - HealthyFastFood`,
    description: `Compare nutrition facts for ${category?.name} across all major restaurant chains. Find the healthiest options and alternatives.`,
  }
}

export default async function CategorySlugPage({ params }: Props) {
  const category = await prisma.category.findUnique({
    where: { 
      slug: params.categorySlug 
    },
    include: {
      meals: {
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
        }
      }
    }
  })

  if (!category) {
    return <div>Category not found</div>
  }

  await prisma.$disconnect()

  return <CategorySlugClient category={category} />
} 