"use client"

import { Button } from "@/components/ui/button"
import { Calculator, DivideCircle, Square, SquareCode, SquareKanban } from "lucide-react"

const THEMATIC_FILTERS = [
  {
    name: "highProtein",
    emoji: "💪",
    label: "Protein per Cal"
  },
  {
    name: "proteinCarbRatio",
    emoji: "⚖️",
    label: "Protein:Carb Ratio"
  },
  {
    name: "lowCarb",
    emoji: "🍞",
    label: "Carbs per Cal"
  },
  {
    name: "lowSodium",
    emoji: "🧂",
    label: "Sodium per Cal"
  },
  {
    name: "lowCholesterol",
    emoji: "❤️",
    label: "Cholesterol per Cal"
  },
  {
    name: "fiber",
    emoji: "🌱",
    label: "Fiber"
  }
] as const

interface Props {
  thematicFilter: string | undefined
  setThematicFilter: (prev: any) => void
  setShowCustomRow: (show: boolean) => void
}

export function RestaurantSectionDesktopThematicSort({ 
  thematicFilter, 
  setThematicFilter, 
  setShowCustomRow 
}: Props) {
  const handleThematicFilter = (filterName: string) => {
    if (thematicFilter === filterName) {
      setThematicFilter(prev => ({
        ...prev,
        thematicFilter: undefined
      }))
      setShowCustomRow(false)
    } else {
      setThematicFilter(prev => ({
        ...prev,
        thematicFilter: filterName
      }))
      setShowCustomRow(true)
    }
  }

  return (
    <section className="mt-2 mb-4 p-2 bg-background border rounded-lg">
      <div className="hidden md:block sticky top-0 z-30  ">
      <div className="text-xs uppercase tracking-wider font-black text-stone-500 flex items-center gap-0.5 pb-1"><DivideCircle className="pb-0.5" size={14} /> <i>Calculate</i>  </div>
        <div className="flex flex-wrap gap-2 items-center">
          
          {THEMATIC_FILTERS.map((filter) => (
            <Button
              key={filter.name}
              variant={thematicFilter === filter.name ? "default" : "outline"}
              size="sm"
              onClick={() => handleThematicFilter(filter.name)}
              className="gap-2"
            >
              <span>{filter.emoji}</span>
              <span>{filter.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
