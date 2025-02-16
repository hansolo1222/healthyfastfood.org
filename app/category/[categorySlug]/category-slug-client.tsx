"use client"

import { useEffect, useState, useMemo } from "react"
import { useSortableData } from "../../../components/UseSortableData"
import {
  calculateCustomNutrition,
  getCustomNutritionRowInfo,
  filterItems,
  formatMealsWithVariants,
} from "../../../components/utils"
import { AsideCalorieFilter } from "../../../components/AsideCalorieFilter"
import { AsideAllergens } from "../../../components/AsideAllergens"
import { RestaurantSectionHeader } from "../../../components/RestaurantSectionHeader"
import { RestaurantSectionDesktopThematicSort } from "../../../components/RestaurantSectionDesktopThematicSort"
import { RestaurantSectionMealsNew } from "../../../components/RestaurantSectionMealsNew"
import { RestaurantSectionChart } from "../../../components/RestaurantSectionChart"
import { RestaurantSectionTabs } from "../../../components/RestaurantSectionTabs"
import { MobileFilterContainer } from "../../../components/MobileFilters/MobileFilterContainer"
import { FilterState } from "../../../app/[restaurant]/restaurant-client"

interface CategoryProps {
  category: any; // Replace 'any' with your proper type
}

// Create a type for the filter state
// export interface FilterState {
//   allergens: string[];
//   thematicFilter: string | undefined;
//   calories: {
//     min: number | null;
//     max: number | null;
//   };
//   parentCategories?: ("food" | "beverages" | "condiments")[] | undefined;

// }

export default function CategorySlugClient({
  category,
}: CategoryProps) {
  const pages = [
    { name: "All Categories", href: `/` },
    { name: category.name, href: `/category/${category.slug}` },
  ];

  const [filters, setFilters] = useState<FilterState>({
    allergens: [],
    thematicFilter: undefined,
    calories: {
      min: null,
      max: null,
    },
    parentCategories: []
  });

  // Memoize the formatted meals
  const formattedMeals = useMemo(
    () => formatMealsWithVariants(category.meals),
    [category.meals]
  );

  console.log(formattedMeals)

  // Filter meals based on all criteria
  const filteredMeals = useMemo(() => {
    let filtered = formattedMeals;

    // Apply calorie filter
    if (filters.calories.min !== null || filters.calories.max !== null) {
      filtered = filtered.filter((meal) => {
        const meetsMin = filters.calories.min === null || meal.calories >= filters.calories.min;
        const meetsMax = filters.calories.max === null || meal.calories <= filters.calories.max;
        return meetsMin && meetsMax;
      });
    }

    // Apply allergen filters
    if (filters.allergens.length > 0) {
      filtered = filtered.filter((meal) => {
        return filters.allergens.every(allergen => {
          return !meal[allergen];
        });
      });
    }

    return filtered;
  }, [formattedMeals, filters]);

  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "chart">("list");
  const [showCustomRow, setShowCustomRow] = useState(false);

  let { items, requestSort, SortableTableHeader } = useSortableData(filteredMeals, {
    key: "name",
    direction: "ascending"
  });

  useEffect(() => {
    if (filters.thematicFilter) {
      requestSort(
        filters.thematicFilter,
        getCustomNutritionRowInfo(filters.thematicFilter).direction
      );
    }
  }, [filters.thematicFilter, requestSort]);

  return (
    <main className="flex">
      <MobileFilterContainer 
        filters={filters}
        setFilters={setFilters}
        activePreset={activePreset}
        setActivePreset={setActivePreset}
      />

      <aside className="hidden lg:block shrink-0 pb-10 w-56 pr-8">
        <AsideCalorieFilter
          min={filters.calories.min}
          max={filters.calories.max}
          activePreset={activePreset}
          onChange={(min, max, presetName) => {
            setFilters((prev) => ({
              ...prev,
              calories: { min, max },
            }));
            setActivePreset(presetName);
          }}
        />
        <AsideAllergens
          allergens={filters.allergens}
          setAllergens={setFilters}
        />
      </aside>

      <article className="w-full">
        <RestaurantSectionHeader
          pages={pages}
          entity={category}
          titleBlack={`${category.name}`}
          titleGray="Nutrition Facts Comparison"
          emoji={null}
        />

        <RestaurantSectionTabs view={view} onChange={setView} />

        {view === "list" ? (
          <>
            <RestaurantSectionDesktopThematicSort
              thematicFilter={filters.thematicFilter}
              setThematicFilter={(value) => {
                setFilters(prev => ({
                  ...prev,
                  thematicFilter: value
                }));
              }}
              setShowCustomRow={setShowCustomRow}
            />
            <RestaurantSectionMealsNew
              restaurant={null}
              categoriesWithParents={[]}
              showCustomRow={showCustomRow}
              thematicFilter={filters.thematicFilter}
              SortableTableHeader={SortableTableHeader}
              umbrellaCategories={[]}
              getUmbrellaCategory={() => "food"}
              items={items}
              variant="normal"
              group={false}
              showRestaurantData={true}
              isGrouped={false}
            />
          </>
        ) : (
          <RestaurantSectionChart
            setThematicFilter={setFilters}
            restaurant={null}
            categoriesWithParents={[]}
            umbrellaCategories={[]}
            getUmbrellaCategory={() => "food"}
            items={items}
            showRestaurantData={true}
            isGrouped={false}
            yAxis={filters.thematicFilter || "calories"}
          />
        )}
      </article>
    </main>
  );
} 