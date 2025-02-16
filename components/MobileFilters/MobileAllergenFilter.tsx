"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FilterState } from "../../app/[restaurant]/restaurant-client"

const ALLERGENS = [
  { id: "allergen_milk", label: "Milk" },
  { id: "allergen_eggs", label: "Eggs" },
  { id: "allergen_fish", label: "Fish" },
  { id: "allergen_shellfish", label: "Shellfish" },
  { id: "allergen_tree_nuts", label: "Tree Nuts" },
  { id: "allergen_peanuts", label: "Peanuts" },
  { id: "allergen_wheat", label: "Wheat" },
  { id: "allergen_soy", label: "Soy" },
] as const

interface MobileAllergenFilterProps {
  allergens: string[]
  setAllergens: (value: React.SetStateAction<FilterState>) => void
}

export function MobileAllergenFilter({
  allergens,
  setAllergens
}: MobileAllergenFilterProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base">Allergens</Label>
      <div className="grid grid-cols-2 gap-2">
        {ALLERGENS.map(({ id, label }) => (
          <Button
            key={id}
            variant={allergens.includes(id) ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setAllergens((prev: FilterState) => ({
                ...prev,
                allergens: allergens.includes(id)
                  ? prev.allergens.filter(a => a !== id)
                  : [...prev.allergens, id]
              }))
            }}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
} 