"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const CALORIE_PRESETS = [
  { name: '0-200', label: '0-200 calories', min: 0, max: 200 },
  { name: '200-400', label: '200-400 calories', min: 200, max: 400 },
  { name: '400-600', label: '400-600 calories', min: 400, max: 600 },
  { name: '600-800', label: '600-800 calories', min: 600, max: 800 },
  { name: '800+', label: '800+ calories', min: 800, max: 10000 },
];

interface CalorieFilterMobileProps {
  min: number | null
  max: number | null
  activePreset: string | null
  onChange: (min: number | null, max: number | null, presetName: string | null) => void
}

export function CalorieFilterMobile({
  min,
  max,
  activePreset,
  onChange
}: CalorieFilterMobileProps) {
  const [open, setOpen] = useState(false)
  const [tempMin, setTempMin] = useState<string>('')
  const [tempMax, setTempMax] = useState<string>('')

  // Update temp values when props change
  useEffect(() => {
    setTempMin(min?.toString() || '')
    setTempMax(max?.toString() || '')
  }, [min, max])

  const handlePresetClick = (preset: typeof CALORIE_PRESETS[0]) => {
    onChange(preset.min, preset.max, preset.name)
    setOpen(false)
  }

  const handleApply = () => {
    const minVal = tempMin === '' ? null : Number(tempMin)
    const maxVal = tempMax === '' ? null : Number(tempMax)
    onChange(minVal, maxVal, null)
    setOpen(false)
  }

  const clearFilter = () => {
    onChange(null, null, null)
    setTempMin('')
    setTempMax('')
  }

  const getButtonText = () => {
    if (activePreset) {
      const preset = CALORIE_PRESETS.find(p => p.name === activePreset)
      return preset?.label || 'Custom'
    }
    if (min !== null || max !== null) {
      if (min !== null && max !== null) {
        return `${min}-${max} cal`
      } else if (min !== null) {
        return `${min}+ cal`
      } else {
        return `Up to ${max} cal`
      }
    }
    return "Calories"
  }

  const hasFilter = activePreset !== null || min !== null || max !== null

  return (
    <div className=" flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "justify-between font-normal",
              hasFilter && "text-pink-600 border-pink-600"
            )}
          >
            {getButtonText()}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-3" align="start">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filter by Calories</h4>
              {hasFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilter}
                  className="h-auto p-1 text-xs text-gray-500"
                >
                  Clear
                </Button>
              )}
            </div>
            
            {/* Preset buttons */}
            <div className="space-y-1">
              {CALORIE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetClick(preset)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    "hover:bg-gray-100",
                    activePreset === preset.name && "bg-pink-50 text-pink-600 hover:bg-pink-100"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom range */}
            <div className="border-t pt-3">
              <p className="text-xs text-gray-600 mb-2">Custom range</p>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={tempMin}
                  onChange={(e) => setTempMin(e.target.value)}
                  placeholder="Min"
                  className="w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <span className="text-xs text-gray-500">to</span>
                <input
                  type="number"
                  value={tempMax}
                  onChange={(e) => setTempMax(e.target.value)}
                  placeholder="Max"
                  className="w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <Button
                onClick={handleApply}
                size="sm"
                className="w-full mt-2"
                variant="default"
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilter}
          className="h-8 w-8 p-0"
          title="Clear filter"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
} 