"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { X, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { FilterState } from "../app/[restaurant]/restaurant-client"

const ALLERGENS = [
  { id: "allergen_milk", label: "No Milk" },
  { id: "allergen_eggs", label: "No Eggs" },
  { id: "allergen_fish", label: "No Fish" },
  { id: "allergen_shellfish", label: "No Shellfish" },
  { id: "allergen_tree_nuts", label: "No Tree Nuts" },
  { id: "allergen_peanuts", label: "No Peanuts" },
  { id: "allergen_wheat", label: "No Wheat" },
  { id: "allergen_soy", label: "No Soy" },
] as const

interface AllergenFilterMobileProps {
  allergens: string[]
  setAllergens: (value: React.SetStateAction<FilterState>) => void
}

export function AllergenFilterMobile({
  allergens,
  setAllergens
}: AllergenFilterMobileProps) {
  const [open, setOpen] = useState(false)

  const toggleAllergen = (allergenId: string) => {
    setAllergens((prev: FilterState) => ({
      ...prev,
      allergens: prev.allergens.includes(allergenId)
        ? prev.allergens.filter(a => a !== allergenId)
        : [...prev.allergens, allergenId]
    }))
  }

  const clearAllergens = () => {
    setAllergens((prev: FilterState) => ({
      ...prev,
      allergens: []
    }))
  }

  const getButtonText = () => {
    if (allergens.length === 0) {
      return "Allergens"
    }
    return `${allergens.length} Allergen${allergens.length > 1 ? 's' : ''}`
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
              allergens.length > 0 && "text-pink-600 border-pink-600"
            )}
          >
            {getButtonText()}
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-3" align="start">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Exclude Allergens</h4>
              {allergens.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllergens}
                  className="h-auto p-1 text-xs text-gray-500"
                >
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {ALLERGENS.map(({ id, label }) => {
                const isChecked = allergens.includes(id)
                return (
                  <label
                    key={id}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer transition-colors",
                      "hover:bg-gray-100",
                      isChecked && "bg-pink-50 hover:bg-pink-100"
                    )}
                  >
                    <Checkbox
                      id={id}
                      checked={isChecked}
                      onCheckedChange={() => toggleAllergen(id)}
                      className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                    />
                    <span className={cn(
                      "text-sm font-medium leading-none select-none",
                      isChecked && "text-pink-600"
                    )}>
                      {label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {allergens.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllergens}
          className="h-8 w-8 p-0"
          title="Clear allergen filters"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
} 