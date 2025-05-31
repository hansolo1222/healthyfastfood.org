"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useSortableData } from "../../components/UseSortableData";
import {
  calculateCustomNutrition,
  getCustomNutritionRowInfo,
  getUmbrellaCategory,
  handleAllergens,
  filterItems,
  formatMealsWithVariants,
  getCategoriesWithParentsFromMeals,
  sortCategories,
} from "../../components/utils";
import { AsideCalorieFilter } from "../../components/AsideCalorieFilter";
import {
  AsideFilterByParentCategory,
  ParentCategory,
} from "../../components/AsideFilterByParentCategory";
import { AsideAllergens } from "../../components/AsideAllergens";
import { AsideTopRestaurants } from "../../components/AsideTopRestaurants";
import { RestaurantSectionHeader } from "../../components/RestaurantSectionHeader";
import { RestaurantSectionCategories } from "../../components/RestaurantSectionCategories";
import { RestaurantSectionDesktopThematicSort } from "../../components/RestaurantSectionDesktopThematicSort";
import { RestaurantSectionMobileFilter } from "../../components/RestaurantSectionMobileFilter";
import { RestaurantSectionTextBlock } from "../../components/RestaurantSectionTextBlock";
import { RestaurantSectionMealsNew } from "../../components/RestaurantSectionMealsNew";
import { RestaurantSectionChart } from "../../components/RestaurantSectionChart";
import { RestaurantSectionTabs } from "../../components/RestaurantSectionTabs";

import EmailSignup from "../../components/EmailSignup";

import _ from "lodash";
import { MobileFilterContainer } from "../../components/MobileFilters/MobileFilterContainer";
import { DietMenuTabs } from "../../components/DietMenuTabs";
import { RestaurantCategoriesMobile } from "../../components/RestaurantCategoriesMobile";
import { CalorieFilterMobile } from "../../components/CalorieFilterMobile";
import { AllergenFilterMobile } from "../../components/AllergenFilterMobile";
// import { MobileFilterContainer } from "@/components/MobileFilters/MobileFilterContainer"
MobileFilterContainer
interface RestaurantProps {
  restaurant: any; // Replace 'any' with your proper type
  restaurants: any[];
  restaurantType: string;
}

// Create a type for the filter state
export interface FilterState {
  parentCategories: ("food" | "beverages" | "condiments")[];
  allergens: string[];
  thematicFilter: string | undefined;
  calories: {
    min: number | null;
    max: number | null;
  };
}

// Add interface for the params
interface GenerateMetadataProps {
  params: { restaurant: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

interface SortConfig {
  key: string;
  direction: "ascending" | "descending";
}

export default function RestaurantClient({
  restaurant,
  restaurants,
  restaurantType,
}: RestaurantProps) {
  const pages = [
    { name: "All Restaurants", href: `/restaurants` },
    { name: restaurant.name, href: `/${restaurant.slug}` },
  ];

  // console.log("Restaurant data:", restaurant);

  // Combined filters
  const [filters, setFilters] = useState<FilterState>({
    parentCategories: ["food", "beverages", "condiments"],
    allergens: [],
    thematicFilter: undefined,
    calories: {
      min: null,
      max: null,
    },
  });

  // Memoize the formatted meals
  const formattedMeals = useMemo(
    () => formatMealsWithVariants(restaurant.meals),
    [restaurant.meals]
  );

  const categoriesWithParents = sortCategories(
    getCategoriesWithParentsFromMeals(formattedMeals)
  );

  const [selectedTypes, setSelectedTypes] = useState<ParentCategory[]>([
    "food",
    "beverages",
    "condiments",
  ]);

  //--------------------------- MEALS & FILTERS ---------------------------
  const [mealData, setMealData] = useState(formattedMeals);
  const [showCustomRow, setShowCustomRow] = useState(false);

  const [caloriesMessage, setCaloriesMessage] = useState("");

  // Mobile only
  const [showCalorieFilter, setShowCalorieFilter] = useState(false);

  const scrollRef = useRef(null);

  //-------------------- FILTER & RELOAD ----------------------

  // Filter meals based on calorie range and other filters
  const filteredMeals = useMemo(() => {
    return filterItems(
      formattedMeals,
      filters.parentCategories,
      filters.allergens,
      filters.calories.min || 0,
      filters.calories.max || 10000,
      null
    );
  }, [formattedMeals, filters]);

  useEffect(() => {
    setMealData(filteredMeals);
    if (filters.thematicFilter) {
      requestSort(
        filters.thematicFilter,
        getCustomNutritionRowInfo(filters.thematicFilter).direction
      );
    }
  }, [
    filters.thematicFilter,
    filters.parentCategories,
    filters.calories.max,
    filters.calories.min,
    filters.allergens,
    filteredMeals
  ]);

  const [activePreset, setActivePreset] = useState<string | null>(null);

  //--------------------------- SORT ---------------------------

  let { items, requestSort, SortableTableHeader, sortConfig } = useSortableData(filteredMeals, {
    key: "name",
    direction: "ascending"
  });

  // Add selectedCategories to your state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Filter items by selected categories
  const filteredItems = selectedCategories.length === 0
    ? items
    : items.filter((item) => selectedCategories.includes(item.categoryName));

  const [isGrouped, setIsGrouped] = useState(true);

  return (
    <>
      {/* <MobileFilterContainer 
        filters={filters}
        setFilters={setFilters}
        activePreset={activePreset}
        setActivePreset={setActivePreset}   /> */}
      <main className="flex" itemScope itemType="https://schema.org/Restaurant">
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
          <AsideFilterByParentCategory
            selectedTypes={filters.parentCategories}
            onChange={(types) => {
              setFilters((prev) => ({
                ...prev,
                parentCategories: types,
              }));
            }}
          />
        </aside>

        <article className="w-full" itemProp="menu" itemScope itemType="https://schema.org/Menu">
          <RestaurantSectionHeader
            pages={pages}
            entity={restaurant}
            titleBlack={restaurant.name}
            titleGray={` Nutrition Facts and Calories`}
            emoji={null}
            totalItems={filteredItems.length}
            description={restaurant.description}
          />

          {filteredItems.length === 0 ? (
            <div className="mt-8 p-8 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 text-lg">
                No menu items are currently available for {restaurant.name}.
              </p>
              <p className="text-gray-500 mt-2">
                Please check back later for nutrition information.
              </p>
            </div>
          ) : (
            <>
              <DietMenuTabs restaurantSlug={restaurant.slug} />

              <div ref={scrollRef} />

              {/* Desktop Filters */}
              <div className="hidden md:block">
                <RestaurantSectionCategories
                  categories={categoriesWithParents}
                  restaurant={restaurant}
                  onCategoryChange={setSelectedCategories}
                  isGrouped={isGrouped}
                  setIsGrouped={setIsGrouped}
                />
              </div>

              {/* Mobile Filters */}
              <div className="md:hidden px-2">
                <div className="flex flex-wrap gap-2">
                  <RestaurantCategoriesMobile
                    categories={categoriesWithParents}
                    restaurant={restaurant}
                    onCategoryChange={setSelectedCategories}
                    isGrouped={isGrouped}
                    setIsGrouped={setIsGrouped}
                  />
                  
                  <CalorieFilterMobile
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
                  
                  <AllergenFilterMobile
                    allergens={filters.allergens}
                    setAllergens={setFilters}
                  />
                </div>
              </div>

              {/* Commented out for now */}
              {/* <RestaurantSectionDesktopThematicSort
                thematicFilter={filters.thematicFilter}
                setThematicFilter={setFilters}
                setShowCustomRow={setShowCustomRow}
              /> */}

              <div aria-label="Menu items nutrition table">
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
                  requestSort={requestSort}
                  sortConfig={sortConfig}
                />
              </div>

              <section className="mt-8 p-6 bg-white rounded-lg" itemScope itemType="https://schema.org/FAQPage">
                <h2 className="text-xl font-semibold mb-4">
                  Frequently Asked Questions about {restaurant.name} Nutrition
                </h2>
                <div className="space-y-4">
                  {filteredItems.length > 0 ? (
                    <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                      <h3 itemProp="name" className="font-medium">
                        What is the lowest calorie item at {restaurant.name}?
                      </h3>
                      <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                        <p itemProp="text" className="text-gray-600 mt-1">
                          {(() => {
                            const lowestCalItem = filteredItems.reduce((min, item) => 
                              item.calories < min.calories ? item : min
                            );
                            return `The ${lowestCalItem.name} with only ${lowestCalItem.calories} calories.`;
                          })()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-600">
                      <p>No menu items are currently available for {restaurant.name}.</p>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </article>
      </main>
    </>
  );
}
