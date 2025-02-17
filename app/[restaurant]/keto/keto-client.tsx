"use client"

import { useEffect, useState, useMemo } from "react"
import { useSortableData } from "../../../components/UseSortableData"
import {
  calculateCustomNutrition,
  getCustomNutritionRowInfo,
  getUmbrellaCategory,
  filterItems,
  formatMealsWithVariants,
  getCategoriesWithParentsFromMeals,
  sortCategories,
} from "../../../components/utils"
import { AsideCalorieFilter } from "../../../components/AsideCalorieFilter"
import {
  AsideFilterByParentCategory,
  ParentCategory,
} from "../../../components/AsideFilterByParentCategory"
import { AsideAllergens } from "../../../components/AsideAllergens"
import { RestaurantSectionHeader } from "../../../components/RestaurantSectionHeader"
import { RestaurantSectionCategories } from "../../../components/RestaurantSectionCategories"
import { RestaurantSectionDesktopThematicSort } from "../../../components/RestaurantSectionDesktopThematicSort"
import { RestaurantSectionTextBlock } from "../../../components/RestaurantSectionTextBlock"
import { RestaurantSectionMealsNew } from "../../../components/RestaurantSectionMealsNew"
import { RestaurantSectionChart } from "../../../components/RestaurantSectionChart"
import { RestaurantSectionTabs } from "../../../components/RestaurantSectionTabs"
import { Slider } from "@mui/material"
import ReactMarkdown from "react-markdown"
import { FilterState } from "../restaurant-client"
import { MobileFilterContainer } from "../../../components/MobileFilters/MobileFilterContainer"
import { AsideMenuType } from "../../../components/AsideMenuType"

interface KetoClientProps {
  restaurant: any
  restaurants: any[]
  restaurantType: string
}

export default function KetoClient({
  restaurant,
  restaurants,
  restaurantType,
}: KetoClientProps) {
  const pages = [
    { name: "All Restaurants", href: `/restaurants` },
    { name: restaurant.name, href: `/${restaurant.slug}` },
    { name: "Keto Menu", href: `/${restaurant.slug}/keto` },
  ]

  // Combined filters
  const [filters, setFilters] = useState<FilterState>({
    parentCategories: ["food", "beverages", "condiments"],
    allergens: [],
    thematicFilter: undefined,
    calories: {
      min: null,
      max: null,
    },
  })
  const [showCustomRow, setShowCustomRow] = useState(false);

  // State for net carb limit - stricter for keto
  const [netCarbLimit, setNetCarbLimit] = useState(20)

  // Memoize the formatted meals with net carbs calculation
  const formattedMeals = useMemo(() => {
    const meals = formatMealsWithVariants(restaurant.meals)
    return meals.map((meal) => ({
      ...meal,
      netCarbohydrates: meal.totalCarbohydrates - meal.dietaryFiber,
    }))
  }, [restaurant.meals])

  const categoriesWithParents = sortCategories(
    getCategoriesWithParentsFromMeals(formattedMeals)
  )

  // Filter meals based on all criteria including net carbs
  const filteredMeals = useMemo(() => {
    let filtered = formattedMeals

    // Apply calorie filter
    if (filters.calories.min !== null || filters.calories.max !== null) {
      filtered = filtered.filter((meal) => {
        const meetsMin = filters.calories.min === null || meal.calories >= filters.calories.min
        const meetsMax = filters.calories.max === null || meal.calories <= filters.calories.max
        return meetsMin && meetsMax
      })
    }

    // Apply net carbs filter
    filtered = filtered.filter((meal) => meal.netCarbohydrates <= netCarbLimit)

    return filtered
  }, [formattedMeals, filters.calories, netCarbLimit])

  let { items, requestSort, SortableTableHeader } = useSortableData(filteredMeals, {
    key: "netCarbohydrates",
    direction: "ascending"
  })

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isGrouped, setIsGrouped] = useState(true)
  const [view, setView] = useState<"list" | "chart">("list")
  const [activePreset, setActivePreset] = useState<string | null>(null)

  // Filter items by selected categories
  const filteredItems = selectedCategories.length === 0
    ? items
    : items.filter((item) => selectedCategories.includes(item.categoryName))

  const marks = [
    { value: 5, label: "5g" },
    { value: 10, label: "10g" },
    { value: 15, label: "15g" },
    { value: 20, label: "20g" },
    { value: 25, label: "25g" },
  ]

  return (
    <main className="flex">
      <MobileFilterContainer 
        filters={filters}
        setFilters={setFilters}
        activePreset={activePreset}
        setActivePreset={setActivePreset}
      />
      <aside className="hidden lg:block shrink-0 pb-10 w-56 pr-8">
        <AsideMenuType 
          restaurantSlug={restaurant.slug}
          activeMenu="keto"
        />
        <AsideCalorieFilter
          min={filters.calories.min}
          max={filters.calories.max}
          activePreset={activePreset}
          onChange={(min, max, presetName) => {
            setFilters((prev) => ({
              ...prev,
              calories: { min, max },
            }))
            setActivePreset(presetName)
          }}
        />
        <AsideAllergens
          allergens={filters.allergens}
          setAllergens={setFilters}
        />
        <AsideFilterByParentCategory
          selectedTypes={filters.parentCategories}
          onChange={(types) => {
            setFilters((prev) => ({
              ...prev,
              parentCategories: types,
            }))
          }}
        />
      </aside>

      <article className="w-full">
        <RestaurantSectionHeader
          pages={pages}
          entity={restaurant}
          titleBlack={`Keto Options at ${restaurant.name}`}
          titleGray="Menu Guide"
          emoji={null}
        />

        <RestaurantSectionTextBlock>
          <ReactMarkdown>{`
Find all the keto-friendly options at ${restaurant.name}. Use the slider to set your net carb limit and explore menu items that fit your ketogenic diet.

**Net carbs** = Total Carbs - Fiber

The default limit is set to 20g net carbs per meal, which is suitable for most keto dieters. Adjust this based on your specific needs.
          `}</ReactMarkdown>
        </RestaurantSectionTextBlock>

        <div className="max-w-2xl mx-auto mb-8 bg-blue-50 text-blue-500 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Net Carb Limit</h3>
            <span className="font-medium">{netCarbLimit}g</span>
          </div>
          <Slider
            value={netCarbLimit}
            onChange={(_, value) => setNetCarbLimit(value as number)}
            marks={marks}
            min={0}
            max={25}
            valueLabelDisplay="auto"
            sx={{
              '& .MuiSlider-thumb': {
                backgroundColor: '#3b82f6',
              },
              '& .MuiSlider-track': {
                backgroundColor: '#3b82f6',
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#93c5fd',
              },
              '& .MuiSlider-mark': {
                backgroundColor: '#3b82f6',
              },
              '& .MuiSlider-markLabel': {
                color: '#3b82f6',
              },
            }}
          />
        </div>

        <RestaurantSectionCategories
          categories={categoriesWithParents}
          restaurant={restaurant}
          onCategoryChange={setSelectedCategories}
          isGrouped={isGrouped}
          setIsGrouped={setIsGrouped}
        />

        <RestaurantSectionTabs view={view} onChange={setView} />

        {view === "list" ? (
          <>
            <RestaurantSectionDesktopThematicSort
                                        setShowCustomRow={setShowCustomRow}

              thematicFilter={filters.thematicFilter}
              setThematicFilter={(value) => {
                setFilters(prev => ({
                  ...prev,
                  thematicFilter: value
                }))
              }}
            />
            <RestaurantSectionMealsNew
              restaurant={restaurant}
              categoriesWithParents={categoriesWithParents}
              showCustomRow={filters.thematicFilter !== undefined}
              thematicFilter={filters.thematicFilter}
              SortableTableHeader={SortableTableHeader}
              umbrellaCategories={filters.parentCategories}
              getUmbrellaCategory={getUmbrellaCategory}
              items={filteredItems}
              variant="normal"
              group={isGrouped}
              showRestaurantData={false}
              isGrouped={isGrouped}
            />
          </>
        ) : (
          <RestaurantSectionChart
            setThematicFilter={setFilters}
            restaurant={restaurant}
            categoriesWithParents={categoriesWithParents}
            umbrellaCategories={filters.parentCategories}
            getUmbrellaCategory={getUmbrellaCategory}
            items={filteredItems}
            showRestaurantData={false}
            isGrouped={isGrouped}
            yAxis={filters.thematicFilter || "netCarbohydrates"}
          />
        )}
      </article>
    </main>
  )
} 