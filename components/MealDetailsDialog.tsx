"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import Image from "next/image"

interface MacroBreakdown {
  protein: number
  carbs: number
  fat: number
  other: number
}

function calculateMacroBreakdown(meal: any): MacroBreakdown {
  const proteinCals = meal.protein * 4
  const carbCals = meal.totalCarbohydrates * 4
  const fatCals = meal.totalFat * 9
  const totalCalculatedCals = proteinCals + carbCals + fatCals
  const otherCals = Math.max(0, meal.calories - totalCalculatedCals)

  return {
    protein: proteinCals,
    carbs: carbCals,
    fat: fatCals,
    other: otherCals
  }
}

const COLORS = {
  protein: '#EB5B00',
  carbs: '#FFB200',
  fat: '#D91656',
  other: '#94a3b8'
}

interface MealDetailsDialogProps {
  meal: any
  isOpen: boolean
  onClose: () => void
  showRestaurantData: boolean
  restaurant?: any
}

export function MealDetailsDialog({ 
  meal, 
  isOpen, 
  onClose,
  showRestaurantData,
  restaurant
}: MealDetailsDialogProps) {
  const macros = calculateMacroBreakdown(meal)
  const totalCals = meal.calories

  const pieData = [
    { 
      name: 'Protein',
      value: macros.protein,
      color: COLORS.protein
    },
    { 
      name: 'Carbs',
      value: macros.carbs,
      color: COLORS.carbs
    },
    { 
      name: 'Fat',
      value: macros.fat,
      color: COLORS.fat
    },
    ...(macros.other > 0 ? [{
      name: 'Other',
      value: macros.other,
      color: COLORS.other
    }] : [])
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {showRestaurantData && (
              <div className="relative w-8 h-8">
                <Image
                  className="rounded-md"
                  src={`/images/logosSmall/${meal.restaurant.slug}.webp`}
                  alt={`${meal.restaurant.name} Logo`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )}
            <div>
              {showRestaurantData && (
                <p className="text-sm text-gray-500">{meal.restaurant.name}</p>
              )}
              <DialogTitle className="text-xl">{meal.name}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-8 mt-6">
          <div>
            <h3 className="font-semibold mb-4">Calorie Breakdown</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    stroke="none"
                    labelLine={true}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      name
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + 25;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      const percent = Math.round((value / totalCals) * 100);
                      
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#374151"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          className="text-xs"
                        >
                          {`${name} ${percent}%`}
                        </text>
                      );
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [
                      `${Math.round(value)} calories`,
                      ''
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Nutrition Facts</h3>
            <div className="space-y-2">
              <div className="flex justify-between border-b pb-1">
                <span>Calories</span>
                <span className="font-medium">{meal.calories}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Total Fat</span>
                <span>{meal.totalFat}g</span>
              </div>
              <div className="flex justify-between border-b pb-1 pl-4">
                <span>Saturated Fat</span>
                <span>{meal.saturatedFat}g</span>
              </div>
              <div className="flex justify-between border-b pb-1 pl-4">
                <span>Trans Fat</span>
                <span>{meal.transFat}g</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Cholesterol</span>
                <span>{meal.cholesterol}mg</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Sodium</span>
                <span>{meal.sodium}mg</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Total Carbohydrates</span>
                <span>{meal.totalCarbohydrates}g</span>
              </div>
              <div className="flex justify-between border-b pb-1 pl-4">
                <span>Dietary Fiber</span>
                <span>{meal.dietaryFiber}g</span>
              </div>
              <div className="flex justify-between border-b pb-1 pl-4">
                <span>Sugar</span>
                <span>{meal.sugar}g</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Protein</span>
                <span>{meal.protein}g</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 