"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateCustomNutrition, getCustomNutritionRowInfo } from "./utils";
import Image from "next/image";

interface MealTableProps {
  categoryName: string | null;
  items: any[];
  showCustomRow: boolean;
  thematicFilter: string | undefined;
  SortableTableHeader: any;
  restaurant: any;
  showRestaurantData: boolean;
  largeDisplay?: boolean;
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
}: MealTableProps) {
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

  return (
    <div className="rounded-md border-none bg-white w-full">
      <Table className="shadow-none table-fixed w-full">
        <TableHeader>
          <TableRow className="bg-stone-100">
            <TableHead
              className="pl-5 text-lg !text-primary"
              style={{ width: "35%" }}
            >
              <SortableTableHeader
                colKey="name"
                name={categoryName || "Item"}
                direction="ascending"
                largeDisplay={largeDisplay}
              />
            </TableHead>
            {showCustomRow && (
              <TableHead
                style={{ width: "13%" }}
                className="text-right bg-green-100"
              >
                <SortableTableHeader
                  colKey="customNutritionRow"
                  name={getCustomNutritionRowInfo(thematicFilter).title}
                  direction={
                    getCustomNutritionRowInfo(thematicFilter).direction
                  }
                />
              </TableHead>
            )}
            <TableHead style={{ width: "8%" }} className="text-right">
              <SortableTableHeader
                colKey="calories"
                name="Calories"
                direction="ascending"
              />
            </TableHead>
            <TableHead style={{ width: "8%" }} className="text-right">
              <SortableTableHeader
                colKey="protein"
                name="Protein"
                direction="descending"
              />
            </TableHead>
            <TableHead style={{ width: "8%" }} className="text-right">
              <SortableTableHeader
                colKey="totalCarbohydrates"
                name="Carbs"
                direction="ascending"
              />
            </TableHead>
            <TableHead style={{ width: "8%" }} className="text-right">
              <SortableTableHeader
                colKey="totalFat"
                name="Fat"
                direction="ascending"
              />
            </TableHead>
            <TableHead style={{ width: "8%" }} className="text-right">
              <SortableTableHeader
                colKey="cholesterol"
                name="Cholesterol"
                direction="ascending"
              />
            </TableHead>
            <TableHead style={{ width: "8%" }} className="text-right">
              <SortableTableHeader
                colKey="sodium"
                name="Sodium"
                direction="ascending"
              />
            </TableHead>
            <TableHead style={{ width: "8%" }} className="text-right">
              <SortableTableHeader
                colKey="sugar"
                name="Sugar"
                direction="ascending"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((meal) => (
            <TableRow key={meal.id || meal.name}>
              <TableCell className={`${showRestaurantData ? "pl-4" : "pl-8"}`}>
                <div className="flex items-center ">
                  {showRestaurantData && (
                    <div className="relative w-6 h-6 mr-3">
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
                      <div className="text-xs text-stone-500">
                        {meal.restaurant.name}
                      </div>
                    )}
                    {showRestaurantData ? (
                      <a
                        href={`/${meal.restaurant.slug}/${meal.slug}`}
                        className="hover:text-stone-600 font-medium"
                      >
                        {meal.name}
                      </a>
                    ) : (
                      <a
                        href={`/${restaurant.slug}/${meal.slug}`}
                        className="hover:text-stone-600 font-medium"
                      >
                        {meal.name}
                      </a>
                    )}
                  </div>
                </div>
              </TableCell>
              {showCustomRow && (
                <TableCell className="text-right bg-green-50">
                  {meal.customNutritionRow}
                  {getCustomNutritionRowInfo(thematicFilter).units}
                </TableCell>
              )}
              <TableCell className="text-right font-medium">
                {meal.calories}
              </TableCell>
              <TableCell className="text-right">
                {meal.protein}
                <span className="text-stone-500 text-sm">g</span>
              </TableCell>
              <TableCell className="text-right">
                {meal.totalCarbohydrates}
                <span className="text-stone-500 text-sm">g</span>
              </TableCell>
              <TableCell className="text-right">
                {parseFloat(meal.totalFat).toFixed(0)}
                <span className="text-stone-500 text-sm">g</span>
              </TableCell>
              <TableCell className="text-right">
                {meal.cholesterol}
                <span className="text-stone-500 text-sm">mg</span>
              </TableCell>
              <TableCell className="text-right">
                {meal.sodium}
                <span className="text-stone-500 text-sm">mg</span>
              </TableCell>
              <TableCell className="text-right">
                {meal.sugar}
                <span className="text-stone-500 text-sm">g</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
}: RestaurantSectionMealsProps) {
  return (
    <section className="mt-6">
      <div className="w-full overflow-x-auto border rounded-lg">
        {isGrouped ? (
          <div className="min-w-[1024px]">
            {categoriesWithParents
              .filter((cat) =>
                umbrellaCategories.includes(
                  getUmbrellaCategory(cat.parentCategory)
                )
              )
              .map((category) => {
                const categoryItems = items.filter(
                  (item) => item.categoryName === category.categoryName
                );
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category.categoryName}>
                    <MealTable
                      categoryName={category.categoryName}
                      items={categoryItems}
                      showCustomRow={showCustomRow}
                      thematicFilter={thematicFilter}
                      SortableTableHeader={SortableTableHeader}
                      restaurant={restaurant}
                      showRestaurantData={showRestaurantData}
                      largeDisplay={true} // makes the header larger
                    />
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="min-w-[1024px]">
            <MealTable
              categoryName={null}
              items={items}
              showCustomRow={showCustomRow}
              thematicFilter={thematicFilter}
              SortableTableHeader={SortableTableHeader}
              restaurant={restaurant}
              showRestaurantData={showRestaurantData}
              largeDisplay={false}
            />
          </div>
        )}
      </div>
    </section>
  );
}
