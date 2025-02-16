"use client"

import { Toggle } from "@/components/ui/toggle"
import { Input } from "@/components/ui/input"
import { FireIcon } from "@heroicons/react/outline"
import { Flame } from "lucide-react"

const CALORIE_PRESETS = [
  { name: '0-200', label: '0-200 cal', min: 0, max: 200 },
  { name: '200-400', label: '200-400 cal', min: 200, max: 400 },
  { name: '400-600', label: '400-600 cal', min: 400, max: 600 },
  { name: '600-800', label: '600-800 cal', min: 600, max: 800 },
  { name: '800+', label: '800+ cal', min: 800, max: 10000 },
] as const

interface AsideCalorieFilterProps {
  min: number | null
  max: number | null
  activePreset: string | null
  onChange: (min: number | null, max: number | null, preset: string | null) => void
}

export function AsideCalorieFilter({ min, max, activePreset, onChange }: AsideCalorieFilterProps) {
  return (
    <section className="mt-5">
      <h3 className="text-stone-900 text-sm font-bold mb-2">Calories</h3>
      
      <div className="flex flex-col space-y-0">
        {CALORIE_PRESETS.map((preset) => (
          <Toggle
            key={preset.name}
            pressed={activePreset === preset.name}
            onPressedChange={() => onChange(preset.min, preset.max, preset.name)}
            
            className="justify-start px-1 !py-0 h-6 rounded-md hover:bg-stone-200 flex gap-1 "
          >
            <Flame className="w-4 h-4" />
            <span className="text-sm   leading-none">
              {preset.label}
            </span>
          </Toggle>
        ))}
      </div>

      <div className="flex items-center space-x-2 mt-3">
        <Input
          type="number"
          value={min ?? ''}
          onChange={(e) => onChange(
            e.target.value ? Number(e.target.value) : null,
            max,
            null
          )}
          placeholder="Min"
          className="h-8 text-sm"
        />
        <span className="text-sm text-stone-500">to</span>
        <Input
          type="number"
          value={max ?? ''}
          onChange={(e) => onChange(
            min,
            e.target.value ? Number(e.target.value) : null,
            null
          )}
          placeholder="Max"
          className="h-8 text-sm"
        />
      </div>
    </section>
  )
} 