import { QuickNutritionStats } from "./QuickNutritionStats";
import { QuickNutritionSummary } from "./QuickNutritionSummary";
import { Breadcrumbs } from "./Breadcrumbs";

import Image from "next/image";
import { useState } from "react";
export const SectionIntro = ({ meal, restaurantName, restaurantSlug, pages }) => {
  console.log(meal)
  if (!meal.subvariants){
    meal.subvariants=[]
  }
  const [src, setSrc] = useState(
    `/images/meals/${restaurantSlug}/${meal.slug}.webp`
  );
  return (
    <section className="mt-0 md:mt-8 pb-8">
      <div className="flex mt-4">
        <div className="border rounded-xl h-full md:flex justify-center items-center overflow-hidden hidden">
          <Image
            src={src}
            alt={`${meal.name}`}
            height="120px"
            width="120px"
            objectFit="contain"
            className="border"
            onError={() =>
              setSrc(
                "/images/categories/" +
                  meal.category.parentCategorySlug +
                  ".webp"
              )
            }
          />
        </div>
        <div className="ml-0 md:ml-6">
          <Breadcrumbs pages={pages} />

          <div className="flex items-center mt-4 md:mt-0">
            <div className="relative w-8 h-8 md:w-12 md:h-12 mr-2 md:mr-4 block md:hidden">
              <Image
                className=" flex-shrink-0 rounded-md mr-2 z-0"
                src={src}
                alt={`${meal.name}`}
                layout="fill"
                objectFit="contain"
                onError={() =>
                  setSrc(
                    "/images/categories/" +
                      meal.category.parentCategorySlug +
                      ".webp"
                  )
                }
              />
            </div>
            <h1 className="text-lg md:text-xl lg:text-3xl font-bold mt-1">
              {meal.name}{" "}
              <span className="text-stone-500 font-normal">
                Nutrition Facts
              </span>
            </h1>
          </div>

          {meal.variants.length == 0 && meal.subvariants.length==0 && (
            <>
              <QuickNutritionStats meal={meal} />
              <QuickNutritionSummary
                meal={meal}
                restaurantName={restaurantName}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};
