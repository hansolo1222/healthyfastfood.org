"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ParentCategory } from "../../components/AsideFilterByParentCategory"

const TYPE_FILTERS = [
  { id: 'food', label: 'Food' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'condiments', label: 'Condiments' },
] as const

interface MobileTypeFilterProps {
  selectedTypes: ParentCategory[]
  onChange: (types: ParentCategory[]) => void
}

export function MobileTypeFilter({
  selectedTypes,
  onChange
}: MobileTypeFilterProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base">Show</Label>
      <div className="grid grid-cols-3 gap-2">
        {TYPE_FILTERS.map(({ id, label }) => (
          <Button
            key={id}
            variant={selectedTypes.includes(id) ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (selectedTypes.includes(id)) {
                onChange(selectedTypes.filter(t => t !== id))
              } else {
                onChange([...selectedTypes, id])
              }
            }}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
} 