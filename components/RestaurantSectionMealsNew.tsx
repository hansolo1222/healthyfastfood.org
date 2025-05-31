"use client";

import { useState, useRef, useEffect } from "react";
import { calculateCustomNutrition, getCustomNutritionRowInfo } from "./utils";
import Image from "next/image";
import { MealDetailsDialog } from "./MealDetailsDialog";
import { cn } from "@/lib/utils";
import { ChevronUpIcon, ChevronDown } from "lucide-react";

interface MealTableProps {
  categoryName: string | null;
  items: any[];
  showCustomRow: boolean;
  thematicFilter: string | undefined;
  SortableTableHeader: any;
  restaurant: any;
  showRestaurantData: boolean;
  largeDisplay?: boolean;
  requestSort?: (key: string, direction?: string) => void;
  sortConfig?: { key: string; direction: string } | null;
}

function MealTable({
  categoryName,
  items,
  showCustomRow,
  thematicFilter,
  SortableTableHeader,
  restaurant,
  showRestaurantData,
  largeDisplay = false,
  requestSort,
  sortConfig = null,
}: MealTableProps) {
  const [selectedMeal, setSelectedMeal] = useState<any>(null);

  const itemsWithCustomNutrition = items.map((item) => {
    const customValue = calculateCustomNutrition(thematicFilter, item);
    return {
      ...item,
      customNutritionRow: thematicFilter ? customValue : null,
    };
  });

  const sortedItems = thematicFilter
    ? itemsWithCustomNutrition.sort((a, b) => {
        const direction = getCustomNutritionRowInfo(thematicFilter).direction;
        if (direction === "ascending") {
          return a.customNutritionRow - b.customNutritionRow;
        } else {
          return b.customNutritionRow - a.customNutritionRow;
        }
      })
    : itemsWithCustomNutrition;

  // Mobile-optimized column configuration
  const columns = [
    { 
      key: 'name', 
      label: 'Item', 
      mobileLabel: 'Item',
      className: 'w-[140px] max-w-[140px] md:w-[240px] md:max-w-[240px]',
      headerClass: 'pl-3 text-left',
      cellClass: 'pl-3 pr-2',
      sticky: true,
      sortKey: 'name',
      align: 'left',
      defaultDirection: 'ascending'
    },
    ...(showCustomRow ? [{
      key: 'custom',
      label: getCustomNutritionRowInfo(thematicFilter)?.title || 'Custom',
      mobileLabel: getCustomNutritionRowInfo(thematicFilter)?.title?.substring(0, 4) || 'CUST',
      className: 'w-16 md:w-20',
      headerClass: 'text-center bg-green-50',
      cellClass: 'text-center bg-green-50/50',
      sortKey: 'customNutritionRow',
      highlight: true,
      align: 'center',
      defaultDirection: getCustomNutritionRowInfo(thematicFilter)?.direction || 'ascending'
    }] : []),
    { 
      key: 'calories', 
      label: 'Calories', 
      mobileLabel: 'CAL',
      className: 'w-12 md:w-20',
      sortKey: 'calories',
      align: 'center',
      defaultDirection: 'ascending'
    },
    { 
      key: 'protein', 
      label: 'Protein', 
      mobileLabel: 'PROT',
      className: 'w-12 md:w-20',
      sortKey: 'protein',
      unit: 'g',
      align: 'center',
      defaultDirection: 'descending'
    },
    { 
      key: 'carbs', 
      label: 'Carbs', 
      mobileLabel: 'CARB',
      className: 'w-12 md:w-20',
      sortKey: 'totalCarbohydrates',
      unit: 'g',
      align: 'center',
      defaultDirection: 'ascending'
    },
    { 
      key: 'fat', 
      label: 'Fat', 
      mobileLabel: 'FAT',
      className: 'w-12 md:w-20',
      sortKey: 'totalFat',
      unit: 'g',
      align: 'center',
      defaultDirection: 'ascending'
    },
    { 
      key: 'sodium', 
      label: 'Sodium', 
      mobileLabel: 'SOD',
      className: 'w-14 md:w-20',
      sortKey: 'sodium',
      unit: 'mg',
      align: 'center',
      defaultDirection: 'ascending'
    },
    { 
      key: 'sugar', 
      label: 'Sugar', 
      mobileLabel: 'SUG',
      className: 'w-12 md:w-20',
      sortKey: 'sugar',
      unit: 'g',
      align: 'center',
      defaultDirection: 'ascending'
    },
    { 
      key: 'fiber', 
      label: 'Fiber', 
      mobileLabel: 'FIB',
      className: 'w-12 md:w-20',
      sortKey: 'dietaryFiber',
      unit: 'g',
      align: 'center',
      defaultDirection: 'descending'
    },
    { 
      key: 'cholesterol', 
      label: 'Chol', 
      mobileLabel: 'CHOL',
      className: 'w-14 md:w-20',
      sortKey: 'cholesterol',
      unit: 'mg',
      align: 'center',
      defaultDirection: 'ascending'
    },
    // New columns at the end
    { 
      key: 'proteinPerCal', 
      label: 'Protein/Cal', 
      mobileLabel: 'P/Cal',
      className: 'w-16 md:w-24',
      sortKey: 'proteinPerCalorie',
      align: 'center',
      defaultDirection: 'descending',
      decimals: 3
    },
    { 
      key: 'proteinCarbRatio', 
      label: 'P:C Ratio', 
      mobileLabel: 'P:C',
      className: 'w-14 md:w-20',
      sortKey: 'proteinCarbRatio',
      align: 'center',
      defaultDirection: 'descending',
      decimals: 2
    },
  ];

  const getValue = (meal: any, key: string) => {
    switch (key) {
      case 'custom': return meal.customNutritionRow;
      case 'calories': return meal.calories;
      case 'protein': return meal.protein;
      case 'proteinPerCal': 
        // Calculate if not present: protein / calories
        if (meal.proteinPerCalorie) return meal.proteinPerCalorie;
        if (meal.protein && meal.calories && meal.calories > 0) {
          return meal.protein / meal.calories;
        }
        return null;
      case 'proteinCarbRatio': 
        // Calculate if not present: protein / carbs
        if (meal.proteinCarbRatio) return meal.proteinCarbRatio;
        if (meal.protein && meal.totalCarbohydrates && meal.totalCarbohydrates > 0) {
          return meal.protein / meal.totalCarbohydrates;
        }
        return null;
      case 'carbs': return meal.totalCarbohydrates;
      case 'fat': return meal.totalFat;
      case 'sodium': return meal.sodium;
      case 'sugar': return meal.sugar;
      case 'fiber': return meal.dietaryFiber;
      case 'cholesterol': return meal.cholesterol;
      default: return null;
    }
  };

  const SortArrow = ({ sortKey, defaultDirection }: { sortKey: string; defaultDirection: string }) => {
    const isSorted = sortConfig?.key === sortKey;
    
    if (!isSorted) return null;
    
    // Show arrow based on current direction
    const isAscending = sortConfig.direction === 'ascending';
    
    return (
      <span className="ml-0.5 inline-flex">
        {isAscending ? (
          <ChevronUpIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-600" />
        ) : (
          <ChevronDown className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-600" />
        )}
      </span>
    );
  };

  return (
    <div className="bg-white">
      {/* Category Header - ESPN Style */}
      {categoryName && (
        <div className="bg-gray-900 text-white px-1 py-1.5 text-xs  font-semibold uppercase tracking-wider">
          {categoryName}
        </div>
      )}
      
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-thin">
        <div className="inline-block min-w-full">
          {/* Header Row */}
          <div className="flex bg-gray-100 border-b border-gray-200">
            {columns.map((col) => (
              <div
                key={col.key}
                className={cn(
                  col.className,
                  col.headerClass,
                  "flex items-center justify-center pt-1.5 pb-1 px-1 cursor-pointer hover:bg-gray-200 transition-colors",
                  "text-xs md:text-sm font-semibold uppercase tracking-wider",
                  col.sticky && "sticky left-0 z-20 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]",
                  sortConfig?.key === col.sortKey && "!bg-blue-100 hover:!bg-blue-200"
                )}
                onClick={() => {
                  if (col.sortKey && requestSort) {
                    requestSort(col.sortKey, col.defaultDirection);
                  }
                }}
              >
                <span className={cn("truncate flex items-center", col.align === 'left' && "w-full")}>
                  <span className="hidden md:inline">{col.label}</span>
                  <span className="md:hidden">{col.mobileLabel}</span>
                  {col.sortKey && <SortArrow sortKey={col.sortKey} defaultDirection={col.defaultDirection} />}
                </span>
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {sortedItems.map((meal, rowIndex) => (
            <div
              key={meal.id || `${meal.name}-${rowIndex}`}
              className={cn(
                "flex border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors",
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              )}
              onClick={() => setSelectedMeal(meal)}
            >
              {columns.map((col) => (
                <div
                  key={`${meal.id}-${col.key}`}
                  className={cn(
                    col.className,
                    col.cellClass,
                    "flex items-center py-2 px-1 text-xs md:text-sm",
                    col.sticky && "sticky left-0 z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]",
                    col.align === 'center' && "justify-center",
                    col.align === 'left' && "justify-start",
                    sortConfig?.key === col.sortKey && "!bg-blue-50"
                  )}
                >
                  {col.key === 'name' ? (
                    <div className="flex items-center w-full min-w-0">
                  {showRestaurantData && (
                        <div className="relative w-4 h-4 md:w-5 md:h-5 mr-1.5 flex-shrink-0">
                      <Image
                            className="rounded"
                        src={`/images/logosSmall/${meal.restaurant.slug}.webp`}
                        alt={`${meal.restaurant.name} Logo`}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  )}
                      <div className="min-w-0 flex-1 overflow-hidden">
                    {showRestaurantData && (
                          <div className="text-[10px] md:text-xs text-gray-500 truncate">
                        {meal.restaurant.name}
                      </div>
                    )}
                        <div className="font-  truncate pr-2">
                          {meal.name}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className={cn(
                      "tabular-nums",
                      col.key === 'custom' && "font-semibold text-green-600"
                    )}>
                      {(() => {
                        const value = getValue(meal, col.key);
                        if (value === null || value === undefined) return '-';
                        
                        // Format based on column type
                        if (col.decimals) {
                          return parseFloat(value).toFixed(col.decimals);
                        }
                        return value;
                      })()}
                      {col.unit && getValue(meal, col.key) && (
                        <span className="text-[10px] md:text-xs text-gray-400 ml-0.5">
                          {col.unit}
                        </span>
                      )}
                      {col.key === 'custom' && getValue(meal, col.key) && (
                        <span className="text-[10px] md:text-xs text-gray-400 ml-0.5">
                          {getCustomNutritionRowInfo(thematicFilter)?.units}
                        </span>
                      )}
                    </span>
                    )}
                  </div>
              ))}
                </div>
          ))}
        </div>
      </div>

      {selectedMeal && (
        <MealDetailsDialog
          meal={selectedMeal}
          isOpen={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          showRestaurantData={showRestaurantData}
          restaurant={restaurant}
        />
      )}
    </div>
  );
}

interface RestaurantSectionMealsProps {
  restaurant: any;
  categoriesWithParents: any[];
  showCustomRow: boolean;
  thematicFilter: string | undefined;
  SortableTableHeader: any;
  umbrellaCategories: string[];
  getUmbrellaCategory: (category: string) => string;
  items: any[];
  variant: "normal" | "keto";
  showRestaurantData: boolean;
  group?: boolean;
  isGrouped: boolean;
  requestSort?: (key: string, direction?: string) => void;
  sortConfig?: { key: string; direction: string };
}

export function RestaurantSectionMealsNew({
  restaurant,
  categoriesWithParents,
  showCustomRow,
  thematicFilter,
  SortableTableHeader,
  umbrellaCategories,
  getUmbrellaCategory,
  items,
  showRestaurantData,
  isGrouped,
  requestSort,
  sortConfig,
}: RestaurantSectionMealsProps) {
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Process all items with custom nutrition
  const processedItems = items.map((item) => {
    const customValue = calculateCustomNutrition(thematicFilter, item);
    return {
      ...item,
      customNutritionRow: thematicFilter ? customValue : null,
    };
  });

  // Sort items if thematic filter is active
  const sortedItems = thematicFilter
    ? processedItems.sort((a, b) => {
        const direction = getCustomNutritionRowInfo(thematicFilter).direction;
        if (direction === "ascending") {
          return a.customNutritionRow - b.customNutritionRow;
        } else {
          return b.customNutritionRow - a.customNutritionRow;
        }
      })
    : processedItems;

  // Group items by category if needed
  const groupedItems = isGrouped
    ? categoriesWithParents
              .filter((cat) =>
          umbrellaCategories.includes(getUmbrellaCategory(cat.parentCategory))
        )
        .map((category) => ({
          categoryName: category.categoryName,
          items: sortedItems.filter((item) => item.categoryName === category.categoryName),
        }))
        .filter((group) => group.items.length > 0)
    : [{ categoryName: null, items: sortedItems }];

  // Column configuration (same as before)
  const columns = [
    { 
      key: 'name', 
      label: 'Item', 
      mobileLabel: 'Item',
      className: 'w-[140px] max-w-[140px] md:w-[240px] md:max-w-[240px]',
      headerClass: 'pl-3 text-left',
      cellClass: 'pl-3 pr-2',
      sticky: true,
      sortKey: 'name',
      align: 'left',
      defaultDirection: 'ascending'
    },
    ...(showCustomRow ? [{
      key: 'custom',
      label: getCustomNutritionRowInfo(thematicFilter)?.title || 'Custom',
      mobileLabel: getCustomNutritionRowInfo(thematicFilter)?.title?.substring(0, 4) || 'CUST',
      className: 'w-16 md:w-20',
      headerClass: 'text-center bg-green-50',
      cellClass: 'text-center bg-green-50/50',
      sortKey: 'customNutritionRow',
      highlight: true,
      align: 'center',
      defaultDirection: getCustomNutritionRowInfo(thematicFilter)?.direction || 'ascending'
    }] : []),
    { 
      key: 'calories', 
      label: 'Calories', 
      mobileLabel: 'CAL',
      className: 'w-12 md:w-20',
      sortKey: 'calories',
      align: 'center',
      defaultDirection: 'ascending'
    },
    { 
      key: 'protein', 
      label: 'Protein', 
      mobileLabel: 'PROT',
      className: 'w-12 md:w-20',
      sortKey: 'protein',
      unit: 'g',
      align: 'center',
      defaultDirection: 'descending'
    },
    { 
      key: 'carbs', 
      label: 'Carbs', 
      mobileLabel: 'CARB',
      className: 'w-12 md:w-20',
      sortKey: 'totalCarbohydrates',
      unit: 'g',
      align: 'center',
      defaultDirection: 'ascending'
    },
    { 
      key: 'fat', 
      label: 'Fat', 
      mobileLabel: 'FAT',
      className: 'w-12 md:w-20',
      sortKey: 'totalFat',
      unit: 'g',
      align: 'center',
      defaultDirection: 'ascending'
    },
    { 
      key: 'sodium', 
      label: 'Sodium', 
      mobileLabel: 'SOD',
      className: 'w-14 md:w-20',
      sortKey: 'sodium',
      unit: 'mg',
      align: 'center',
      defaultDirection: 'ascending'
    },
    { 
      key: 'sugar', 
      label: 'Sugar', 
      mobileLabel: 'SUG',
      className: 'w-12 md:w-20',
      sortKey: 'sugar',
      unit: 'g',
      align: 'center',
      defaultDirection: 'ascending'
    },
    { 
      key: 'fiber', 
      label: 'Fiber', 
      mobileLabel: 'FIB',
      className: 'w-12 md:w-20',
      sortKey: 'dietaryFiber',
      unit: 'g',
      align: 'center',
      defaultDirection: 'descending'
    },
    { 
      key: 'cholesterol', 
      label: 'Chol', 
      mobileLabel: 'CHOL',
      className: 'w-14 md:w-20',
      sortKey: 'cholesterol',
      unit: 'mg',
      align: 'center',
      defaultDirection: 'ascending'
    },
    // New columns at the end
    { 
      key: 'proteinPerCal', 
      label: 'Protein/Cal', 
      mobileLabel: 'P/Cal',
      className: 'w-16 md:w-24',
      sortKey: 'proteinPerCalorie',
      align: 'center',
      defaultDirection: 'descending',
      decimals: 3
    },
    { 
      key: 'proteinCarbRatio', 
      label: 'P:C Ratio', 
      mobileLabel: 'P:C',
      className: 'w-14 md:w-20',
      sortKey: 'proteinCarbRatio',
      align: 'center',
      defaultDirection: 'descending',
      decimals: 2
    },
  ];

  const getValue = (meal: any, key: string) => {
    switch (key) {
      case 'custom': return meal.customNutritionRow;
      case 'calories': return meal.calories;
      case 'protein': return meal.protein;
      case 'proteinPerCal': 
        // Calculate if not present: protein / calories
        if (meal.proteinPerCalorie) return meal.proteinPerCalorie;
        if (meal.protein && meal.calories && meal.calories > 0) {
          return meal.protein / meal.calories;
        }
        return null;
      case 'proteinCarbRatio': 
        // Calculate if not present: protein / carbs
        if (meal.proteinCarbRatio) return meal.proteinCarbRatio;
        if (meal.protein && meal.totalCarbohydrates && meal.totalCarbohydrates > 0) {
          return meal.protein / meal.totalCarbohydrates;
        }
        return null;
      case 'carbs': return meal.totalCarbohydrates;
      case 'fat': return meal.totalFat;
      case 'sodium': return meal.sodium;
      case 'sugar': return meal.sugar;
      case 'fiber': return meal.dietaryFiber;
      case 'cholesterol': return meal.cholesterol;
      default: return null;
    }
  };

  const SortArrow = ({ sortKey, defaultDirection }: { sortKey: string; defaultDirection: string }) => {
    const isSorted = sortConfig?.key === sortKey;
    
    if (!isSorted) return null;
    
    // Show arrow based on current direction
    const isAscending = sortConfig.direction === 'ascending';
    
    return (
      <span className="ml-0.5 inline-flex">
        {isAscending ? (
          <ChevronUpIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-600" />
        ) : (
          <ChevronDown className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-600" />
        )}
      </span>
    );
  };

  return (
    <section className="mt-2 md:mt-6">
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
        {/* Single scrollable container for all tables */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-thin"
        >
          <div className="inline-block min-w-full">
            {/* Fixed header that doesn't scroll vertically */}
            <div className="sticky top-0 z-30 bg-white">
              <div className="flex bg-gray-100 border-b border-gray-200">
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={cn(
                      col.className,
                      col.headerClass,
                      "flex items-center justify-center pt-1.5 pb-1 px-1 cursor-pointer hover:bg-gray-200 transition-colors",
                      "text-xs md:text-sm font-semibold uppercase tracking-wider",
                      col.sticky && "sticky left-0 z-20 bg-gray-100 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]",
                      sortConfig?.key === col.sortKey && "!bg-blue-100 hover:!bg-blue-200"
                    )}
                    onClick={() => {
                      if (col.sortKey && requestSort) {
                        requestSort(col.sortKey, col.defaultDirection);
                      }
                    }}
                  >
                    <span className={cn("truncate flex items-center", col.align === 'left' && "w-full")}>
                      <span className="hidden md:inline">{col.label}</span>
                      <span className="md:hidden">{col.mobileLabel}</span>
                      {col.sortKey && <SortArrow sortKey={col.sortKey} defaultDirection={col.defaultDirection} />}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* All data rows */}
            {groupedItems.map((group, groupIndex) => (
              <div key={group.categoryName || 'all'}>
                {/* Category Header */}
                {group.categoryName && (
                  <div className="flex">
                    <div className="bg-gray-900 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider sticky left-0 z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
                      {group.categoryName}
                    </div>
                    <div className="bg-gray-900 flex-1" />
                  </div>
                )}

                {/* Data rows for this category */}
                {group.items.map((meal, rowIndex) => {
                  const actualRowIndex = groupedItems
                    .slice(0, groupIndex)
                    .reduce((sum, g) => sum + g.items.length, 0) + rowIndex;
                  const rowBgColor = actualRowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50";

                return (
                    <div
                      key={meal.id || `${meal.name}-${rowIndex}`}
                      className={cn(
                        "flex hover:bg-gray-50 cursor-pointer transition-colors",
                        rowBgColor,
                        rowIndex === group.items.length - 1 && groupIndex < groupedItems.length - 1 && "border-b-2 border-gray-200"
                      )}
                      onClick={() => setSelectedMeal(meal)}
                    >
                      {columns.map((col) => (
                        <div
                          key={`${meal.id}-${col.key}`}
                          className={cn(
                            col.className,
                            col.cellClass,
                            "flex items-center py-2 px-1 text-xs md:text-sm border-b border-gray-100",
                            col.sticky && cn(
                              "sticky left-0 z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]",
                              rowBgColor
                            ),
                            col.align === 'center' && "justify-center",
                            col.align === 'left' && "justify-start",
                            sortConfig?.key === col.sortKey && "!bg-blue-50"
                          )}
                        >
                          {col.key === 'name' ? (
                            <div className="flex items-center w-full min-w-0">
                              {showRestaurantData && (
                                <div className="relative w-4 h-4 md:w-5 md:h-5 mr-1.5 flex-shrink-0">
                                  <Image
                                    className="rounded"
                                    src={`/images/logosSmall/${meal.restaurant.slug}.webp`}
                                    alt={`${meal.restaurant.name} Logo`}
                                    layout="fill"
                                    objectFit="contain"
                                  />
                                </div>
                              )}
                              <div className="min-w-0 flex-1 overflow-hidden">
                                {showRestaurantData && (
                                  <div className="text-[10px] md:text-xs text-gray-500 truncate">
                                    {meal.restaurant.name}
                                  </div>
                                )}
                                <div className="font-medium truncate pr-2" title={meal.name}>
                                  {meal.name}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className={cn(
                              "tabular-nums",
                              col.key === 'custom' && "font-semibold text-green-600"
                            )}>
                              {(() => {
                                const value = getValue(meal, col.key);
                                if (value === null || value === undefined) return '-';
                                
                                if (col.decimals) {
                                  return parseFloat(value).toFixed(col.decimals);
                                }
                                return value;
                              })()}
                              {col.unit && getValue(meal, col.key) && (
                                <span className="text-[10px] md:text-xs text-gray-400 ml-0.5">
                                  {col.unit}
                                </span>
                              )}
                              {col.key === 'custom' && getValue(meal, col.key) && (
                                <span className="text-[10px] md:text-xs text-gray-400 ml-0.5">
                                  {getCustomNutritionRowInfo(thematicFilter)?.units}
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                );
              })}
          </div>
            ))}
          </div>
        </div>

        {selectedMeal && (
          <MealDetailsDialog
            meal={selectedMeal}
            isOpen={!!selectedMeal}
            onClose={() => setSelectedMeal(null)}
            showRestaurantData={showRestaurantData}
              restaurant={restaurant}
            />
        )}
      </div>
    </section>
  );
}
