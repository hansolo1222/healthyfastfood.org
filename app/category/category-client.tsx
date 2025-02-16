"use client"

import { category, meal, restaurant } from '@prisma/client'
import { MiniTableMealRow } from "../../components/TableMealRow"
import { useState } from "react"
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
  


interface CategoryWithMeals extends category {
  parentCategory: { name: string } | null;
  meals: (meal & {
    restaurant: restaurant;
    category: category & {
      parentCategory: { name: string } | null;
    };
  })[];
}

interface CategoryClientProps {
  categories: CategoryWithMeals[]
}

export default function CategoryClient({ categories }: CategoryClientProps) {
  // Track open/closed state for each parent category
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})

  // Group categories by parent category
  const groupedCategories = categories.reduce((acc, category) => {
    const parentName = category.parentCategory?.name || 'Other'
    if (!acc[parentName]) {
      acc[parentName] = []
    }
    acc[parentName].push(category)
    return acc
  }, {} as Record<string, CategoryWithMeals[]>)

  const toggleCategory = (parentName: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [parentName]: !prev[parentName]
    }))
  }

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Browse by Category
      </h1>

      {Object.entries(groupedCategories).map(([parentName, categories]) => (
        <div key={parentName} className="mb-6">
          <button
            onClick={() => toggleCategory(parentName)}
            className="w-full flex items-center justify-between text-left p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              {parentName}
            </h2>
            {openCategories[parentName] ? (
              <ChevronDownIcon className="h-6 w-6 text-gray-500" />
            ) : (
              <ChevronRightIcon className="h-6 w-6 text-gray-500" />
            )}
          </button>

          {openCategories[parentName] && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">
                      <a 
                        href={`/category/${category.slug}`}
                        className="hover:text-blue-600"
                      >
                        {category.name}
                      </a>
                    </h3>
                  </div>

                  {category.meals.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-100">
                          {category.meals.map((meal) => (
                            <MiniTableMealRow
                              key={meal.id}
                              meal={meal}
                              restaurantName={meal.restaurant.name}
                              restaurantSlug={meal.restaurant.slug}
                              showRestaurantData={true}
                              showCustomRow={false}
                              customRowKey=""
                              customRowUnits=""
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="p-4 text-gray-500 text-sm">
                      No items found in this category
                    </p>
                  )}

                  {category.meals.length > 0 && (
                    <div className="p-4 bg-gray-50 border-t">
                      <a
                        href={`/category/${category.slug}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View all in {category.name} →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </main>
  )
} 