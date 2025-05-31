"use client"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState, useEffect } from "react"

interface Category {
  categoryName: string
  categorySlug: string
}

interface RestaurantSectionCategoriesProps {
  restaurant: any
  categories: Category[]
  onCategoryChange: (categories: string[]) => void
  isGrouped: boolean
  setIsGrouped: (grouped: boolean) => void
}

export function RestaurantSectionCategories({
  restaurant,
  categories,
  onCategoryChange,
  isGrouped,
  setIsGrouped
}: RestaurantSectionCategoriesProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
      
      return newSelection.length === 0 ? [] : newSelection
    })
  }

  const selectAllCategories = () => {
    setSelectedCategories([])
  }

  // Notify parent component of changes
  useEffect(() => {
    onCategoryChange(selectedCategories)
  }, [selectedCategories, onCategoryChange])

  return (
    <section className="w-full mb-4">
      <section className="  ">
       

        <div className="flex items-start gap-2">

        {/* <RadioGroup
            defaultValue={isGrouped ? "grouped" : "ungrouped"}
            onValueChange={(value) => setIsGrouped(value === "grouped")}
            className="flex bg-stone-100 rounded gap-0"
          >
            <div className="flex items-center">
              <RadioGroupItem
                value="grouped"
                id="grouped"
                className="hidden"
              />
              <Button
                variant={"secondary"}
                size="sm"
                asChild
                className={`cursor-pointer ${isGrouped ? "bg-white text-pink-500  border-pink-500 border shadow-sm" : "shadow-none border border-transparent text-stone-500 hover:bg-stone-200"}`}
              >
                <label htmlFor="grouped">
                  Group
                </label>
              </Button>
            </div>

            <div className="flex items-center">
              <RadioGroupItem
                value="ungrouped"
                id="ungrouped"
                className="hidden"
              />
              <Button
                variant={"secondary"}
                size="sm"
                asChild
                className={`cursor-pointer ${isGrouped ? "shadow-none border border-transparent text-stone-500 hover:bg-stone-200" : "bg-white border text-pink-500  border-pink-500 shadow-sm"}`}
              >
                <label htmlFor="ungrouped">
                  Don't Group
                </label>
              </Button>
            </div>
          </RadioGroup> */}
        <div className="flex flex-wrap gap-2 ">
          <Button
            variant={"outline"}
            size="sm"
            className={`rounded-lg ${selectedCategories.length === 0 ? "bg-stone-200" : ""}`}
            onClick={selectAllCategories}
          >
            All Categories
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.categorySlug}
              variant={"outline"}
              size="sm"
              className={`rounded-lg ${selectedCategories.includes(cat.categoryName) ? "bg-stone-200" : ""}`}
              onClick={() => toggleCategory(cat.categoryName)}
            >
              {cat.categoryName}
            </Button>
          ))}
          </div>
        </div>
      </section>
    </section>
  )
}
