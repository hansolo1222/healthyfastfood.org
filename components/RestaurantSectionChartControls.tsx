"use client"

import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"

interface Props {
  showLabels: boolean
  onToggleLabels: () => void
}

export function RestaurantSectionChartControls({ 
  showLabels,
  onToggleLabels
}: Props) {
  return (
    <section className="mb-4 p-2 bg-background border rounded-lg">
      <div className="flex items-center gap-2">
        <Button
          variant={showLabels ? "default" : "outline"}
          size="sm"
          onClick={onToggleLabels}
          className="gap-2"
        >
          <Tag className="h-4 w-4" />
          <span>Show Labels</span>
        </Button>
      </div>
    </section>
  )
} 