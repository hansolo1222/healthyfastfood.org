"use client"

import { Button } from "@/components/ui/button"
import { DivideCircle } from "lucide-react"

export interface YAxisOption {
  name: string;
  label: string;
  emoji?: string
}

export const X_AXIS_OPTIONS = [
  { name: "calories", label: "Calories" },
  { name: "protein", label: "Protein (g)" },
  { name: "totalCarbohydrates", label: "Carbs (g)" },
  { name: "totalFat", label: "Fat (g)" },
  { name: "cholesterol", label: "Cholesterol (mg)" },
  { name: "sodium", label: "Sodium (mg)" },
  { name: "sugar", label: "Sugar (g)" }
] as const

export const Y_AXIS_OPTIONS:any = [
 
  // Calculated metrics
  {
    name: "highProtein",
    emoji: "💪",
    label: "Protein per Cal"
  },
  {
    name: "percentProtein",
    emoji: "💪",
    label: "% cal from protein"
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
  xAxis: string
  yAxis: string
  onXAxisChange: (axis: string) => void
  onYAxisChange: (axis: string) => void
}

export function RestaurantSectionChartAxisSelection({ 
  xAxis,
  yAxis,
  onXAxisChange,
  onYAxisChange
}: Props) {
  return (
    <section className="mb-4 p-2 bg-background border rounded-lg space-y-4">
      <div className="hidden md:block sticky top-0 z-30">
        {/* X Axis Selection */}
        <div className="mb-4">
          <div className="text-xs uppercase tracking-wider font-black text-stone-500 flex items-center gap-0.5 pb-1">
            <DivideCircle className="pb-0.5" size={14} /> 
            <i>X-Axis</i>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {X_AXIS_OPTIONS.map((option) => (
              <Button
                key={option.name}
                variant={xAxis === option.name ? "default" : "outline"}
                size="sm"
                onClick={() => onXAxisChange(option.name)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Y Axis Selection */}
        <div>
          <div className="text-xs uppercase tracking-wider font-black text-stone-500 flex items-center gap-0.5 pb-1">
            <DivideCircle className="pb-0.5" size={14} /> 
            <i>Y-Axis</i>
          </div>
          <div className=" ">
            {/* Standard Metrics */}
            <div className="flex flex-wrap gap-2 items-center">
              {Y_AXIS_OPTIONS.slice(0, 7).map((option) => (
                <Button
                  key={option.name}
                  variant={yAxis === option.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => onYAxisChange(option.name)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Divider */}
 
            {/* Calculated Metrics */}
            <div className="flex flex-wrap gap-2 items-center pt-2">
              {Y_AXIS_OPTIONS.slice(7).map((option) => (
                <Button
                  key={option.name}
                  variant={yAxis === option.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => onYAxisChange(option.name)}
                  className="gap-2"
                >

                    <span>{ option.emoji}</span> 
                  <span>{option.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 