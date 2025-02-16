"use client"

import { FilterState } from "../../app/[restaurant]/restaurant-client"
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { useState } from "react"
import { MobileCalorieFilter } from "./MobileCalorieFilter"
import { MobileAllergenFilter } from "./MobileAllergenFilter"
import { MobileTypeFilter } from "./MobileTypeFilter"

interface MobileFilterContainerProps {
  filters: FilterState
  setFilters: (value: React.SetStateAction<FilterState>) => void
  activePreset: string | null
  setActivePreset: (value: string | null) => void
}

export function MobileFilterContainer({ 
  filters, 
  setFilters,
  activePreset,
  setActivePreset
}: MobileFilterContainerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="sticky top-0 z-10 bg-white border-b lg:hidden">
      <div className="flex items-center justify-between p-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 py-4">
              <MobileCalorieFilter 
                min={filters.calories.min}
                max={filters.calories.max}
                activePreset={activePreset}
                onChange={(min, max, presetName) => {
                  setFilters(prev => ({
                    ...prev,
                    calories: { min, max }
                  }))
                  setActivePreset(presetName)
                }}
              />
              <MobileAllergenFilter
                allergens={filters.allergens}
                setAllergens={setFilters}
              />
              <MobileTypeFilter
                selectedTypes={filters.parentCategories}
                onChange={(types) => {
                  setFilters(prev => ({
                    ...prev,
                    parentCategories: types
                  }))
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex gap-2">
          {filters.calories.min !== null && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setFilters(prev => ({
                  ...prev,
                  calories: { min: null, max: null }
                }))
                setActivePreset(null)
              }}
            >
              Calories: {filters.calories.min}-{filters.calories.max}
              <span className="ml-1">×</span>
            </Button>
          )}
          {filters.allergens.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setFilters(prev => ({
                  ...prev,
                  allergens: []
                }))
              }}
            >
              Allergens ({filters.allergens.length})
              <span className="ml-1">×</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 