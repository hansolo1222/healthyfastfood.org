"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSortableData } from "../../components/UseSortableData";
import {
  calculateCustomNutrition,
  getCustomNutritionRowInfo,
  getUmbrellaCategory,
  filterItems,
  formatMealsWithVariants,
  getCategoriesWithParentsFromMeals,
  sortCategories,
} from "../../components/utils";
import { RestaurantSectionMealsNew } from "../../components/RestaurantSectionMealsNew";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  SlidersHorizontal,
  Utensils,
  Store,
  Flame,
  Beef,
  Wheat,
  TrendingUp
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalorieFilterMobile } from "../../components/CalorieFilterMobile";
import { AllergenFilterMobile } from "../../components/AllergenFilterMobile";
import { cn } from "@/lib/utils";

interface ExploreClientProps {
  meals: any[];
  restaurants: any[];
  categories: any[];
  stats: any;
  initialQuery: string;
}

export default function ExploreClient({
  meals,
  restaurants,
  categories,
  stats,
  initialQuery
}: ExploreClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(initialQuery);
  
  // Filter states
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [calorieRange, setCalorieRange] = useState({ min: null, max: null });
  const [proteinRange, setProteinRange] = useState({ min: null, max: null });
  const [allergens, setAllergens] = useState<string[]>([]);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  
  // Quick filter presets
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);
  
  // Sort state
  const [sortBy, setSortBy] = useState("name");
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Parse quick filters from URL
  useEffect(() => {
    const quickFilter = searchParams.get('quickFilter');
    if (quickFilter) {
      if (quickFilter === 'low-calorie' && !activeQuickFilters.includes('low-calorie')) {
        setActiveQuickFilters(['low-calorie']);
      } else if (quickFilter === 'high-protein' && !activeQuickFilters.includes('high-protein')) {
        setActiveQuickFilters(['high-protein']);
      }
    }
  }, [searchParams]);

  // Format meals
  const formattedMeals = useMemo(
    () => formatMealsWithVariants(meals),
    [meals]
  );

  // Apply filters
  const filteredMeals = useMemo(() => {
    let filtered = [...formattedMeals];

    // Search filter
    if (debouncedSearch) {
      filtered = filtered.filter(meal => 
        meal.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        meal.restaurant.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Restaurant filter
    if (selectedRestaurants.length > 0) {
      filtered = filtered.filter(meal => 
        selectedRestaurants.includes(meal.restaurant.slug)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(meal => 
        selectedCategories.includes(meal.categoryName)
      );
    }

    // Calorie filter
    if (calorieRange.min !== null || calorieRange.max !== null) {
      filtered = filtered.filter(meal => {
        if (calorieRange.min !== null && meal.calories < calorieRange.min) return false;
        if (calorieRange.max !== null && meal.calories > calorieRange.max) return false;
        return true;
      });
    }

    // Protein filter
    if (proteinRange.min !== null || proteinRange.max !== null) {
      filtered = filtered.filter(meal => {
        if (proteinRange.min !== null && meal.protein < proteinRange.min) return false;
        if (proteinRange.max !== null && meal.protein > proteinRange.max) return false;
        return true;
      });
    }

    // Allergen filter
    if (allergens.length > 0) {
      filtered = filtered.filter(meal => {
        return !allergens.some(allergen => meal[allergen] === true);
      });
    }

    // Quick filters
    if (activeQuickFilters.includes('high-protein')) {
      filtered = filtered.filter(meal => meal.protein >= 30);
    }
    if (activeQuickFilters.includes('low-calorie')) {
      filtered = filtered.filter(meal => meal.calories <= 400);
    }
    if (activeQuickFilters.includes('keto')) {
      filtered = filtered.filter(meal => 
        meal.totalCarbohydrates <= 10 && meal.totalFat >= 15
      );
    }
    if (activeQuickFilters.includes('vegetarian')) {
      filtered = filtered.filter(meal => 
        meal.categoryName !== 'Steaks' && 
        meal.categoryName !== 'Chicken' &&
        meal.categoryName !== 'Seafood'
      );
    }

    return filtered;
  }, [
    formattedMeals, 
    debouncedSearch, 
    selectedRestaurants, 
    selectedCategories,
    calorieRange,
    proteinRange,
    allergens,
    activeQuickFilters
  ]);

  // Sort configuration
  let { items, requestSort, SortableTableHeader, sortConfig } = useSortableData(filteredMeals, {
    key: sortBy,
    direction: sortBy === 'name' ? 'ascending' : 'descending'
  });

  const toggleQuickFilter = (filter: string) => {
    setActiveQuickFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedRestaurants([]);
    setSelectedCategories([]);
    setCalorieRange({ min: null, max: null });
    setProteinRange({ min: null, max: null });
    setAllergens([]);
    setActiveQuickFilters([]);
  };

  const hasActiveFilters = 
    searchQuery || 
    selectedRestaurants.length > 0 || 
    selectedCategories.length > 0 ||
    calorieRange.min !== null ||
    calorieRange.max !== null ||
    proteinRange.min !== null ||
    proteinRange.max !== null ||
    allergens.length > 0 ||
    activeQuickFilters.length > 0;

  return (
    <main className="min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Explore Menu Items
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by meal name or restaurant..."
                className="pl-12 pr-4 py-3 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Button
              variant={activeQuickFilters.includes('high-protein') ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleQuickFilter('high-protein')}
              className="gap-1"
            >
              <Beef className="w-4 h-4" />
              High Protein (30g+)
            </Button>
            <Button
              variant={activeQuickFilters.includes('low-calorie') ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleQuickFilter('low-calorie')}
              className="gap-1"
            >
              <Flame className="w-4 h-4" />
              Low Calorie (≤400)
            </Button>
            <Button
              variant={activeQuickFilters.includes('keto') ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleQuickFilter('keto')}
              className="gap-1"
            >
              <Wheat className="w-4 h-4" />
              Keto Friendly
            </Button>
            <Button
              variant={activeQuickFilters.includes('vegetarian') ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleQuickFilter('vegetarian')}
              className="gap-1"
            >
              🥗 Vegetarian
            </Button>
          </div>

          {/* Results Summary */}
          <div className="text-center text-gray-600">
            Found <span className="font-semibold text-gray-900">{items.length}</span> items
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 space-y-6">
            {/* Restaurant Filter */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Store className="w-4 h-4" />
                Restaurants
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {restaurants.map(restaurant => (
                  <label key={restaurant.slug} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRestaurants.includes(restaurant.slug)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRestaurants([...selectedRestaurants, restaurant.slug]);
                        } else {
                          setSelectedRestaurants(selectedRestaurants.filter(r => r !== restaurant.slug));
                        }
                      }}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm">{restaurant.name}</span>
                    <span className="text-xs text-gray-500">({restaurant._count.meals})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                Categories
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {categories.map(category => (
                  <label key={category.slug} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.name]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(c => c !== category.name));
                        }
                      }}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm">{category.name}</span>
                    <span className="text-xs text-gray-500">({category._count.meals})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nutrition Filters */}
            <div>
              <h3 className="font-semibold mb-3">Nutrition Ranges</h3>
              
              {/* Calories */}
              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-1 block">Calories</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={calorieRange.min || ''}
                    onChange={(e) => setCalorieRange({
                      ...calorieRange,
                      min: e.target.value ? Number(e.target.value) : null
                    })}
                    className="w-20"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={calorieRange.max || ''}
                    onChange={(e) => setCalorieRange({
                      ...calorieRange,
                      max: e.target.value ? Number(e.target.value) : null
                    })}
                    className="w-20"
                  />
                </div>
              </div>

              {/* Protein */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Protein (g)</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={proteinRange.min || ''}
                    onChange={(e) => setProteinRange({
                      ...proteinRange,
                      min: e.target.value ? Number(e.target.value) : null
                    })}
                    className="w-20"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={proteinRange.max || ''}
                    onChange={(e) => setProteinRange({
                      ...proteinRange,
                      max: e.target.value ? Number(e.target.value) : null
                    })}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Mobile Filters */}
          <div className="lg:hidden mb-4 flex flex-wrap gap-2">
            <CalorieFilterMobile
              min={calorieRange.min}
              max={calorieRange.max}
              activePreset={activePreset}
              onChange={(min, max, presetName) => {
                setCalorieRange({ min, max });
                setActivePreset(presetName);
              }}
            />
            
            <AllergenFilterMobile
              allergens={allergens}
              setAllergens={(value) => {
                if (typeof value === 'function') {
                  setAllergens(value(allergens));
                } else {
                  setAllergens(value.allergens);
                }
              }}
            />

            <Button variant="outline" size="sm" className="gap-1">
              <Store className="w-4 h-4" />
              Restaurants
              <ChevronDown className="w-3 h-3" />
            </Button>

            <Button variant="outline" size="sm" className="gap-1">
              <Utensils className="w-4 h-4" />
              Categories
              <ChevronDown className="w-3 h-3" />
            </Button>
          </div>

          {/* Sort Options */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {hasActiveFilters ? 'Filtered Results' : 'All Menu Items'}
            </h2>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="calories">Calories (Low to High)</SelectItem>
                <SelectItem value="protein">Protein (High to Low)</SelectItem>
                <SelectItem value="proteinPerCalorie">Protein Efficiency</SelectItem>
                <SelectItem value="totalCarbohydrates">Carbs (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Table */}
          <RestaurantSectionMealsNew
            restaurant={null}
            categoriesWithParents={[]}
            showCustomRow={false}
            thematicFilter={undefined}
            SortableTableHeader={SortableTableHeader}
            umbrellaCategories={["food", "beverages", "condiments"]}
            getUmbrellaCategory={getUmbrellaCategory}
            items={items}
            variant="normal"
            group={false}
            showRestaurantData={true}
            isGrouped={false}
            requestSort={requestSort}
            sortConfig={sortConfig}
          />

          {/* Load More Button */}
          {items.length >= 100 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Results
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 