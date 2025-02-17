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
import { AsideMenuType } from "../../components/AsideMenuType";
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

  let { items, requestSort, SortableTableHeader } = useSortableData(filteredMeals, {
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

  const [view, setView] = useState<"list" | "chart">("list");

  return (
    <>
      <MobileFilterContainer 
        filters={filters}
        setFilters={setFilters}
        activePreset={activePreset}
        setActivePreset={setActivePreset}
      />
      <main className="flex  ">
        <aside className="hidden lg:block shrink-0 pb-10 w-56 pr-8">
          <AsideMenuType 
            restaurantSlug={restaurant.slug}
            activeMenu="full"
          />
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

          {/* <AsideTopRestaurants restaurants={restaurants} /> */}
        </aside>

        <article className="w-full ">
          <RestaurantSectionHeader
            pages={pages}
            entity={restaurant}
            titleBlack={restaurant.name}
            titleGray={` Nutrition Facts and Calories`}
            emoji={null}
          />
          {/* <Tabs activeTab="all" slug={`/${restaurant.slug}`} /> */}

          <div ref={scrollRef} />

          {/* <RestaurantSectionMobileFilter
            showCalorieFilter={showCalorieFilter}
            setShowCalorieFilter={setShowCalorieFilter}
            setMinCalories={(min) => updateFilter("calories", { ...filters.calories, min })}
            setMaxCalories={(max) => updateFilter("calories", { ...filters.calories, max })}
            displayMinCalories={filters.calories.min === 0 ? null : filters.calories.min}
            displayMaxCalories={filters.calories.max === 10000 ? null : filters.calories.max}
            setDisplayMinCalories={setDisplayMinCalories}
            setDisplayMaxCalories={setDisplayMaxCalories}
            caloriesMessage={caloriesMessage}
            setCaloriesMessage={setCaloriesMessage}
            caloriePreset={caloriePreset}
            setCaloriePreset={setCaloriePreset}
            thematicFilter={filters.thematicFilter}
            setThematicFilter={setFilters}
            setShowCustomRow={setShowCustomRow}
            scrollRef={scrollRef}
            netCarbLimit={0} // Add these
            netCarbMax={100} // four
            handleNetCarbLimitChange={() => {}} // new
            marks={{}} // props
          /> */}

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
                thematicFilter={filters.thematicFilter}
                setThematicFilter={setFilters}
                setShowCustomRow={setShowCustomRow}
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
              yAxis={filters.thematicFilter || "protein"} // Default to protein if no filter selected
              
            />
          )}

          {/* <FAQ faqs={faqs} /> */}
        </article>
      </main>
      {/* <EmailSignup /> */}
    </>
  );
}
