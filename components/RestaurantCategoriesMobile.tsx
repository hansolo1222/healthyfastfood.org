"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from  "@/components/ui/popover"
import { X, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
  categoryName: string
  categorySlug: string
}

interface RestaurantCategoriesMobileProps {
  restaurant: any
  categories: Category[]
  onCategoryChange: (categories: string[]) => void
  isGrouped: boolean
  setIsGrouped: (grouped: boolean) => void
}

export function RestaurantCategoriesMobile({
  restaurant,
  categories,
  onCategoryChange,
  isGrouped,
  setIsGrouped
}: RestaurantCategoriesMobileProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
      
      return newSelection
    })
  }

  const clearFilters = () => {
    setSelectedCategories([])
  }

  // Notify parent component of changes
  useEffect(() => {
    onCategoryChange(selectedCategories)
  }, [selectedCategories, onCategoryChange])

  const getButtonText = () => {
    if (selectedCategories.length === 0) {
      return "All Categories"
    }
    return `${selectedCategories.length} Categories`
  }

  return (
    <div className=" flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "justify-between font-normal",
              selectedCategories.length > 0 && "text-pink-600 border-pink-600"
            )}
          >
            {getButtonText()}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-3" align="start">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filter by Category</h4>
              {selectedCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-auto p-1 text-xs text-gray-500"
                >
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="grid gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.categoryName)
                return (
                  <button
                    key={cat.categorySlug}
                    onClick={() => toggleCategory(cat.categoryName)}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                      "hover:bg-gray-100",
                      isSelected && "bg-pink-50 text-pink-600 hover:bg-pink-100"
                    )}
                  >
                    <span>{cat.categoryName}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {selectedCategories.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 w-8 p-0"
          title="Clear filters"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
} 