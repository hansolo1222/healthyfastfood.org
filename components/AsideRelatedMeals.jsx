import Image from "next/image";
import { formatParentCategory } from "./TableMealRow";

export const AsideRelatedMeals = ({ meals, restaurant, parentCategory }) => {

  let emoji = formatParentCategory(parentCategory, false, true, false)


  return (
    <div className="mt-8 bg-stone-50 rounded-xl p-2">
      <h2 className="text-stone-500 text-xs uppercase font-semibold p-2 ">
        Related Meals at {restaurant.name}
      </h2>
      {meals.map((meal) => (
        <div className="hover:bg-stone-200 rounded-xl" key={restaurant.slug}>
          <a
            href={`/${meal.restaurantSlug}/${meal.slug}`}
            className="cursor-pointer w-full flex items-center p-2"
            key={meal.restaurantSlug + meal.slug}
          >
            {/* <li key={restaurant.slug} className="list-decimal flex items-center py-1 px-3 rounded-lg hover:bg-stone-100 hover:text-red-500"> */}
            <div className="relative w-6 h-6">
                {emoji}
              {/* <Image
                className=" flex-shrink-0 rounded-md"
                src={`/images/logosSmall/${restaurant.slug}.webp`}
                alt={`${restaurant.name} Logo`}
                layout="fill"
                objectFit="contain"
              /> */}
            </div>
            <div className="pl-2 text-stone-500 text-sm">{meal.name}</div>
          </a>
        </div>
      ))}
    </div>
  );
};


export const AsideRelatedMealsOtherRestaurants = ({ meals }) => {

  return (
    <div className="mt-8 bg-stone-50 rounded-xl p-2">
      <h2 className="text-stone-500 text-xs uppercase font-semibold p-2 ">
        People also looked at
      </h2>
      {meals.map((meal) => (
        <div className="hover:bg-stone-200 rounded-xl" key={meal.slug}>
          <a
            href={`/${meal.restaurantSlug}/${meal.slug}`}
            className="cursor-pointer w-full flex items-start p-3"
            key={meal.restaurantSlug + meal.slug}
          >
            {/* <li key={restaurant.slug} className="list-decimal flex items-center py-1 px-3 rounded-lg hover:bg-stone-100 hover:text-red-500"> */}
            <div className="relative w-6 h-6">
               
              <Image
                className=" flex-shrink-0 rounded-md"
                src={`/images/logosSmall/${meal.restaurantSlug}.webp`}
                alt={`${meal.restaurantSlug} Logo`}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="pl-2 text-stone-500 text-sm"><b>{meal.restaurant.name}</b><br/>{meal.name}</div>
          </a>
        </div>
      ))}
    </div>
  );
};
