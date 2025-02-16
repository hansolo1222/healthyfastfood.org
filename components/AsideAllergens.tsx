"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { FilterState } from "../app/[restaurant]/restaurant-client"

// Update allergen mapping to match schema fields
const ALLERGENS = [
  { id: "allergen_milk", label: "No Milk" },
  { id: "allergen_eggs", label: "No Eggs" },
  { id: "allergen_fish", label: "No Fish" },
  { id: "allergen_shellfish", label: "No Shellfish" },
  { id: "allergen_tree_nuts", label: "No Tree Nuts" },
  { id: "allergen_peanuts", label: "No Peanuts" },
  { id: "allergen_wheat", label: "No Wheat" },
  { id: "allergen_soy", label: "No Soy" },
  // { id: "allergen_gluten", label: "Gluten Free" },
] as const

interface AsideAllergensProps {
  allergens: string[]
  setAllergens: (value: React.SetStateAction<FilterState>) => void
}

export function AsideAllergens({ 
  allergens, 
  setAllergens 
}: AsideAllergensProps) {
  return (
    <section className="mt-6">
      <h3 className="text-stone-900 text-sm font-bold mb-2">
        Allergy Filters
      </h3>
      {/* <p className="text-sm text-gray-600 mb-4">
        Select to exclude items containing these allergens
      </p> */}
      <div className="flex flex-col space-y-0">
        {ALLERGENS.map(({ id, label }) => (
          <label 
            key={id}
            htmlFor={id} 
            className="flex items-center space-x-2 px-1 py-1 rounded-md hover:bg-stone-200 cursor-pointer"
          >
            <Checkbox 
              id={id}
              checked={allergens.includes(id)}
              onCheckedChange={(checked) => {
                setAllergens((prev: FilterState) => ({
                  ...prev,
                  allergens: checked 
                    ? [...prev.allergens, id]
                    : prev.allergens.filter(a => a !== id)
                }));
              }}
            />
            <span className="text-sm font-medium leading-none">
              {label}
            </span>
          </label>
        ))}
      </div>
    </section>
  )
} 