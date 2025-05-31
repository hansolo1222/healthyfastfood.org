"use client"

import { useState } from "react";
import Image from "next/image";
import { Breadcrumbs } from "./Breadcrumbs";
import { formatParentCategory } from "./TableMealRow";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RestaurantSectionHeaderProps {
  pages: any[];
  entity: any;
  titleBlack: string;
  titleGray: string;
  emoji?: string | null;
  totalItems?: number;
  description?: string; // Optional restaurant description
}

export function RestaurantSectionHeader({
  pages,
  entity,
  titleBlack,
  titleGray,
  emoji,
  totalItems,
  description,
}: RestaurantSectionHeaderProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <section className="mt-2 md:mt-3 pt-3 mb-2 md:mb-4 px-2 md:px-0">
      {/* Breadcrumbs for mobile */}
      <div className="block md:hidden">
        <Breadcrumbs pages={pages} />
      </div>
      <div className="flex items-start justify-between">
        <div className="flex items-start md:items-center flex-1">
          {!emoji ? (
            <div className="relative w-12 h-12 md:w-14 md:h-14 mr-2 md:mr-4 mt-2 md:mt-0 flex-shrink-0">
              <Image
                className="rounded-xl"
                src={`/images/logosSmall/${entity.slug}.webp`}
                alt={`${entity.name} Logo`}
                width={56}
                height={56}
                priority
              />
            </div>
          ) : (
            <div className="text-3xl border rounded-lg h-12 w-12 md:w-14 md:h-14 md:mr-4 mr-2 mt-2 md:mt-0 flex items-center justify-center">
              {formatParentCategory(entity.slug, false, true, false)}
            </div>
          )}
          <div className="flex-1">
            <div>
              <div className="hidden md:block">
                <Breadcrumbs pages={pages} />
              </div>
              <h1 className="text-lg md:text-xl lg:text-xl font-bold mt-1 md:mt-1 leading-snug">
                {titleBlack}
                <span className="text-stone-500 font-normal block sm:inline">
                  {titleGray}
                </span>
              </h1>
            </div>
          </div>
        </div>
        
        {/* Info button */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className={cn(
            "ml-4 mt-3 md:mt-4 p-2 rounded-lg transition-colors",
            "hover:bg-gray-100 group",
            showInfo && "bg-gray-100"
          )}
          aria-label="Toggle restaurant information"
        >
          {showInfo ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Info className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          )}
        </button>
      </div>

      {/* Expandable info section */}
      {showInfo && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-in slide-in-from-top-2 duration-200">
          <h2 className="sr-only">Restaurant Information</h2>
          
          {/* Custom description if provided */}
          {description && (
            <p className="text-sm text-gray-700 mb-3">
              {description}
            </p>
          )}
          
          {/* Default summary */}
          <p className="text-sm text-gray-600">
            Browse {totalItems || "all"} menu items from {entity.name} with complete 
            nutrition information including calories, carbs, fat, protein and more. 
            Filter by dietary preferences and allergens to find meals that fit your needs.
          </p>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 Tip: Click on column headers to sort by nutritional values. 
              Use the filters above to narrow down your options.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
