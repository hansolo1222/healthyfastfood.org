"use client"

import Image from "next/image";
import { Breadcrumbs } from "./Breadcrumbs";
import { formatParentCategory } from "./TableMealRow";

export function RestaurantSectionHeader({
  pages,
  entity,
  titleBlack,
  titleGray,
  emoji,
}) {
  return (
    <section className="mt-2 md:mt-3 pt-3  mb-4 ">
      {/* Breadcrumbs for mobile */}
      <div className="block md:hidden">
        <Breadcrumbs pages={pages} />
      </div>
      <div className="flex items-start md:items-center">
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
        <div className="w-full">
          <div className="md:flex justify-between items-center">
            <>
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
            </>
          </div>
        </div>
      </div>
    </section>
  );
}
