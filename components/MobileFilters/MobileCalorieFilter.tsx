"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const PRESETS = [
  { name: "Light", min: 0, max: 400 },
  { name: "Medium", min: 400, max: 800 },
  { name: "Heavy", min: 800, max: 2000 },
] as const

interface MobileCalorieFilterProps {
  min: number | null
  max: number | null
  activePreset: string | null
  onChange: (min: number | null, max: number | null, presetName: string | null) => void
}

export function MobileCalorieFilter({
  min,
  max,
  activePreset,
  onChange
}: MobileCalorieFilterProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base">Calories</Label>
      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map(preset => (
          <Button
            key={preset.name}
            variant={activePreset === preset.name ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(preset.min, preset.max, preset.name)}
          >
            {preset.name}
          </Button>
        ))}
      </div>
      <div className="pt-2">
        <Slider
          min={0}
          max={2000}
          step={50}
          value={[min || 0, max || 2000]}
          onValueChange={([min, max]) => {
            onChange(min, max, null)
          }}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>{min || 0}</span>
          <span>{max || 2000}</span>
        </div>
      </div>
    </div>
  )
} 