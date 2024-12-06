'use client'

 import Layout from "../../components/Layout";
import { useEffect, useState, useRef } from "react";
import { useSortableData } from "../../components/UseSortableData";

import { NextSeo } from "next-seo";
import { Tabs } from "../../components/Tabs";
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
import { AsideCalorieFilter } from "../../components/AsideFilterByCalories";
import { AsideFilterByUmbrellaCategories } from "../../components/AsideFilterByUmbrellaCategory";
import { AsideAllergens } from "../../components/AsideAllergens";
import { AsideTopRestaurants } from "../../components/AsideTopRestaurants";
import { RestaurantSectionHeader } from "../../components/RestaurantSectionHeader";
import { RestaurantSectionCategories } from "../../components/RestaurantSectionCategories";
import { RestaurantSectionDesktopThematicSort } from "../../components/RestaurantSectionDesktopThematicSort";
import { RestaurantSectionMobileFilter } from "../../components/RestaurantSectionMobileFilter";
import { RestaurantSectionTextBlock } from "../../components/RestaurantSectionTextBlock";
import { RestaurantSectionMeals } from "../../components/RestaurantSectionMeals";

import EmailSignup from "../../components/EmailSignup";
import ReactMarkdown from "react-markdown";
import { FAQ } from "../../components/FAQ";
import _ from "lodash";

import dynamic from "next/dynamic";
import { Suspense } from "react";
 
interface RestaurantProps {
    restaurant: any; // Replace 'any' with your proper type
    restaurants: any[];
    restaurantType: string;
  }
  


export default function RestaurantClient({ 
    restaurant, 
    restaurants, 
    restaurantType 
  }: RestaurantProps) {

    // const DynamicMeals = dynamic(() => import('../../components/RestaurantSectionMeals'), {
    //     suspense: true,
    //   });

  const pages = [
    { name: "All Restaurants", href: `/restaurants` },
    { name: restaurant.name, href: `/${restaurant.slug}` },
  ];

  let meals = formatMealsWithVariants(restaurant.meals);

  const categoriesWithParents = sortCategories(
    getCategoriesWithParentsFromMeals(meals)
  );

  //--------------------------- MEALS & FILTERS ---------------------------
  const [mealData, setMealData] = useState(meals);
  const [umbrellaCategories, setUmbrellaCategories] = useState([
    "food",
    "beverages",
    "condiments",
  ]);
  const [allergens, setAllergens] = useState([]);
  const [thematicFilter, setThematicFilter] = useState();
  const [showCustomRow, setShowCustomRow] = useState(false);

  //--------------------------- CALORIE FILTERS ---------------------------

  // These are live: all data will be filtered by these values
  const [minCalories, setMinCalories] = useState(0);
  const [maxCalories, setMaxCalories] = useState(10000);

  // These are for displaying in the input fields
  const [displayMinCalories, setDisplayMinCalories] = useState(null);
  const [displayMaxCalories, setDisplayMaxCalories] = useState(null);
  const [caloriePreset, setCaloriePreset] = useState({ name: null });
  const [caloriesMessage, setCaloriesMessage] = useState("");

  const closeCalorieFilter = () => {
    document.body.style.overflow = "auto";
    setShowCalorieFilter(false);
  };

  // Mobile only
  const [showCalorieFilter, setShowCalorieFilter] = useState(false);

  const scrollRef = useRef(null);

  //-------------------- FILTER & RELOAD ----------------------

  useEffect(() => {
 
    setMealData(
      filterItems(
        meals.map((m) => {
          return {
            ...m,
            ...(thematicFilter ? { [thematicFilter]: calculateCustomNutrition(thematicFilter, m) } : {}),
          };
        }),
        umbrellaCategories,
        allergens,
        minCalories,
        maxCalories
      )
    );
    requestSort(
      thematicFilter,
      getCustomNutritionRowInfo(thematicFilter).direction
    );
  }, [
    thematicFilter,
    showCustomRow,
    umbrellaCategories,
    maxCalories,
    minCalories,
    allergens,
  ]);

  // console.log(_.groupBy(filteredItems, item => item.categoryName))

  //--------------------------- SORT ---------------------------

  let { items, requestSort, SortableTableHeader } = useSortableData(mealData, {
    key: "name",
    direction: "ascending",
  } as any); // Temporary fix with type assertion
  // console.log(_.chain(items).groupBy("categoryName").value())

  let groupedItems = _.chain(items)
    .groupBy("categoryName")
    // `key` is group's name, `value` is the array of objects that belongs to it
    .map((value, key) => ({ categoryName: key, meals: value }))
    .value();

  let lowestCalories = groupedItems.map((category) => ({
    categoryName: category.categoryName,
    meal: category.meals.reduce((prev, curr) =>
      prev.calories < curr.calories ? prev : curr
    ),
  }));

  let highestCalories = groupedItems.map((category) => ({
    categoryName: category.categoryName,
    meal: category.meals.reduce((prev, curr) =>
      prev.calories > curr.calories ? prev : curr
    ),
  }));

  let highestProtein = groupedItems.map((category) => ({
    categoryName: category.categoryName,
    meal: category.meals.reduce((prev, curr) =>
      prev.protein > curr.protein ? prev : curr
    ),
  }));

  // console.log(lowestCalories)
  // .sort(function(a,b){
  //   if (a.meals[0].category.parentCategorySlug == 'burgers-sandwiches'){
  //     return -1
  //   }

  //       const textA = a.categoryName;
  //       const textB = b.categoryName;
  //       return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  //     })
  // Here I have to implement my own sort. Idea is if it falls under Burgers & Sandwiches (parentCategory) it should go first

  //--------------------------- FAQ ---------------------------

  const faqs = [
    {
      question: `Which foods have the least calories at ${restaurant.name}?`,
      answer: `The foods with the most calories at ${restaurant.name} are: 
      ${lowestCalories
        .map(
          (category) =>
            `<li class='mb-1'><b>${category.categoryName}:</b> <a class='underline' href='/${restaurant.slug}/${category.meal.slug}'>${category.meal.name}</a>, <span class='bg-orange-50 py-1 px-1 rounded-md text-orange-600'>${category.meal.calories} cal</span></li>`
        )
        .join("")}
      `,
    },
    {
      question: `Which foods have the most calories at ${restaurant.name}?`,
      answer: `The foods with the most calories at ${restaurant.name} are: 
      ${highestCalories
        .map(
          (category) =>
            `<li class='mb-1'><b>${category.categoryName}:</b> <a class='underline' href='/${restaurant.slug}/${category.meal.slug}'>${category.meal.name}</a>, <span class='bg-orange-50 py-1 px-1 rounded-md text-orange-600'>${category.meal.calories} cal</span></li>`
        )
        .join("")}
      `,
    },
    {
      question: `Which foods have the most protein at ${restaurant.name}?`,
      answer: `The items with the most protein in every category at ${
        restaurant.name
      } are:
      ${highestProtein
        .map(
          (category) =>
            `<li class='mb-1'><b>${category.categoryName}:</b> <a class='underline' href='/${restaurant.slug}/${category.meal.slug}'>${category.meal.name}</a>,  <span class='bg-green-50 py-1 px-1 rounded-md text-green-500'>${category.meal.protein}g protein</span></li>`
        )
        .join("")}
      `,
    },
  ];

  //---------------------------- STRUCTURED DATA ----------------------------

  return (
    <>
      <NextSeo
        title={`${restaurant.name} Nutrition Facts and Calorie Info [Updated 2022] | HealthyFastFood`}
        description={`Detailed nutrition facts for every menu item at ${restaurant.name}. Also see keto, vegetarian, vegan and allergen menus.`}
        canonical={`https://healthyfastfood.org/${restaurant.slug}`}
        additionalMetaTags={[
          {
            property: "keywords",
            content: `${restaurant.slug},nutrition,facts,`,
          },
        ]}
        openGraph={{
          url: "https://healthyfastfood.org/" + restaurant.slug,
          type: "website",
          title:
            restaurant.name +
            " Menu Nutrition Facts and Calories [Updated 2022] | Healthy Fast Food",
          description:
            "Detailed nutrition facts for every menu item at " +
            restaurant.name +
            ". Also see keto, vegetarian and allergen menus.",
          images: [
            {
              url: `/images/restaurant_logos/${restaurant.slug}.webp`,
              width: 400,
              height: 400,
              alt: restaurant.name + " Logo",
            },
          ],
        }}
        twitter={{
          handle: "@healthyfastfood",
          site: "https://healthyfastfood.org",
          cardType: "summary_large_image",
        }}
      />

 
      
        <main className="flex  ">
          <aside className="hidden lg:block shrink-0 pb-10 w-56 pr-8">
            <AsideCalorieFilter
              setMinCalories={setMinCalories}
              setMaxCalories={setMaxCalories}
              caloriesMessage={caloriesMessage}
              setCaloriesMessage={setCaloriesMessage}
              setCaloriePreset={setCaloriePreset}
              displayMinCalories={displayMinCalories}
              displayMaxCalories={displayMaxCalories}
              setDisplayMinCalories={setDisplayMinCalories}
              setDisplayMaxCalories={setDisplayMaxCalories}
              caloriePreset={caloriePreset} 
            />
         
            <AsideFilterByUmbrellaCategories
              umbrellaCategories={umbrellaCategories}
              setUmbrellaCategories={setUmbrellaCategories}
            />
            <AsideAllergens
              allergens={allergens}
              setAllergens={setAllergens}
              handleAllergens={handleAllergens}
            />
       
            <AsideTopRestaurants restaurants={restaurants} />
          </aside>
           
          <article className="w-full">
          
            <RestaurantSectionHeader
              pages={pages}
              entity={restaurant}
              titleBlack={restaurant.name}
              titleGray={` Nutrition Facts and Calories`}
              emoji={restaurant.emoji || '🍽️'} 
            />
            <Tabs activeTab="all" slug={`/${restaurant.slug}`} />
            <RestaurantSectionTextBlock>
              
            </RestaurantSectionTextBlock>
       
            <RestaurantSectionCategories
              categories={categoriesWithParents}
              restaurant={restaurant}
            />
            <div ref={scrollRef} />
            <RestaurantSectionDesktopThematicSort
              thematicFilter={thematicFilter}
              setThematicFilter={setThematicFilter}
              setShowCustomRow={setShowCustomRow}
            />
            <RestaurantSectionMobileFilter
              showCalorieFilter={showCalorieFilter}
              setShowCalorieFilter={setShowCalorieFilter}
              setMinCalories={setMinCalories}
              setMaxCalories={setMaxCalories}
              displayMinCalories={displayMinCalories}
              displayMaxCalories={displayMaxCalories}
              setDisplayMinCalories={setDisplayMinCalories}
              setDisplayMaxCalories={setDisplayMaxCalories}
              caloriesMessage={caloriesMessage}
              setCaloriesMessage={setCaloriesMessage}
              caloriePreset={caloriePreset}
              setCaloriePreset={setCaloriePreset}
              thematicFilter={thematicFilter}
              setThematicFilter={setThematicFilter}
              setShowCustomRow={setShowCustomRow}
              scrollRef={scrollRef}
              netCarbLimit={0}               // Add these
              netCarbMax={100}              // four
              handleNetCarbLimitChange={() => {}}  // new
              marks={{}}                     // props
            />
           
              <RestaurantSectionMeals
                restaurant={restaurant}
                categoriesWithParents={categoriesWithParents}
                showCustomRow={showCustomRow}
                thematicFilter={thematicFilter}
                SortableTableHeader={SortableTableHeader}
                umbrellaCategories={umbrellaCategories}
                getUmbrellaCategory={getUmbrellaCategory}
                items={items}
                variant="normal"
                group={true}
                showRestaurantData={true} 
              />
         
            {/* <FAQ faqs={faqs} /> */}
          </article>
        </main>
        <EmailSignup />
        {/* <div id="ezoic-pub-ad-placeholder-119"> </div> */}
       
    </>
  );
}
