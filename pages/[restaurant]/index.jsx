import Head from "next/head";
import Layout from "../../components/Layout";
import { useEffect, useState, useRef } from "react";
import { useSortableData } from "../../components/UseSortableData";
import prisma from "../../lib/prisma";
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
import _ from 'lodash';

import dynamic from 'next/dynamic'
import { Suspense } from 'react'


const DynamicMeals = dynamic(() => import('../../components/RestaurantSectionMeals'), {
  suspense: true,
})

export const getStaticProps = async (context) => {

  // res.setHeader(
  //   'Cache-Control',
  //   'public, s-maxage=10, stale-while-revalidate=59'
  // )

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: String(context.params?.restaurant),
    },
    include: {
      meals: {
        include: {
          category: {
            include: {
              parentCategory: true,
            },
          },
          variants: {
            include: {
              subvariants: true,
            },
          },
        },
      },
      restaurantTypes: true,
    },
  });
  if (!restaurant) {
    return {
      notFound: true,
    };
  } 

  const restaurantType = restaurant.restaurantTypes[0].slug;

  const type = await prisma.restaurantType.findUnique({
    where: {
      slug: restaurantType
    },
    include: {
      restaurants: true
    }
  })

  // const restaurants = await prisma.restaurant.findMany({
  //   where: {
  //     restaurantType: {
  //       slug: restaurantType,
  //     },
  //   },
  //   orderBy: [
  //     {
  //       rank: "asc",
  //     },
  //   ],
  // });

  return {
    props: {
      restaurant: JSON.parse(JSON.stringify(restaurant)),
      restaurants: JSON.parse(JSON.stringify(type.restaurants)),
      restaurantType: JSON.parse(JSON.stringify(restaurantType)),
    },
  };
};

export async function getStaticPaths() {
  const restaurants = await prisma.restaurant.findMany()

  // Get the paths we want to pre-render based on posts
  const paths = restaurants.map(rest => ({
      params: {restaurant: rest.slug},
  }));

  // We'll pre-render only these paths at build time.
  return {paths, fallback: false}
}

export default function Restaurant(props) {
  const { restaurant, restaurants, restaurantType } = props;

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
    ezstandalone.define(119,102, 103, 104, 105, 106, 107);
    if (!ezstandalone.enabled) {
      ezstandalone.enable();
      ezstandalone.display();
    }
    else {
      ezstandalone.refresh();
    }
    setMealData(
      filterItems(
        meals.map((m) => {
          return {
            ...m,
            [thematicFilter]: calculateCustomNutrition(thematicFilter, m),
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
  });

  // console.log(_.chain(items).groupBy("categoryName").value())

  let groupedItems = 
    _.chain(items)
      .groupBy("categoryName")
      // `key` is group's name, `value` is the array of objects that belongs to it
      .map((value, key) => ({ categoryName: key, meals: value }))
      .value()
    
    let lowestCalories = groupedItems.map((category)=>({categoryName: category.categoryName, meal: category.meals.reduce((prev, curr) => prev.calories < curr.calories ? prev : curr
    )}))

    let highestCalories = groupedItems.map((category)=>({categoryName: category.categoryName, meal: category.meals.reduce((prev, curr) => prev.calories > curr.calories ? prev : curr
      )}))

    let highestProtein = groupedItems.map((category)=>({categoryName: category.categoryName, meal: category.meals.reduce((prev, curr) => prev.protein > curr.protein ? prev : curr
     )}))

    console.log(lowestCalories)
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
      ${lowestCalories.map((category)=>(`<li class='mb-1'><b>${category.categoryName}:</b> <a class='underline' href='/${restaurant.slug}/${category.meal.slug}'>${category.meal.name}</a>, <span class='bg-orange-50 py-1 px-1 rounded-md text-orange-600'>${category.meal.calories} cal</span></li>`)).join('')}
      `,
    },
    {
      question: `Which foods have the most calories at ${restaurant.name}?`,
      answer: `The foods with the most calories at ${restaurant.name} are: 
      ${highestCalories.map((category)=>(`<li class='mb-1'><b>${category.categoryName}:</b> <a class='underline' href='/${restaurant.slug}/${category.meal.slug}'>${category.meal.name}</a>, <span class='bg-orange-50 py-1 px-1 rounded-md text-orange-600'>${category.meal.calories} cal</span></li>`)).join('')}
      `,
    },
    {
      question: `Which foods have the most protein at ${restaurant.name}?`,
      answer: `The items with the most protein in every category at ${restaurant.name} are:
      ${highestProtein.map((category)=>(`<li class='mb-1'><b>${category.categoryName}:</b> <a class='underline' href='/${restaurant.slug}/${category.meal.slug}'>${category.meal.name}</a>,  <span class='bg-green-50 py-1 px-1 rounded-md text-green-500'>${category.meal.protein}g protein</span></li>`)).join('')}
      `,
    },
    
  ];

  //---------------------------- STRUCTURED DATA ----------------------------

  const addJsonLdMenu = () => {
    return {
      __html: `
    {
      "@context": "http://schema.org",
      "@type": "Menu",
      "url": "https://healthyfastfood.org/${restaurant.slug}",
      "mainEntityOfPage": "https://healthyfastfood.org/${restaurant.slug}",
      "inLanguage":"English",
      "description":"Full Menu for ${restaurant.name}",
      "hasMenuSection": [
        ${categoriesWithParents.map(
          (cat) =>
            `{
          "@type": "MenuSection",
          "name":"${cat.categoryName}",
          "hasMenuItem": [
            ${meals
              .filter((meal) => meal.categoryName == cat.categoryName)
              .map(
                (meal) =>
                  `{
            "@type":"MenuItem",
            "name":"${meal.name.replace(/"/g, '\\"')}",
            "nutrition": {
              "@type":"NutritionInformation",
              "calories":"${meal.calories}",
              "fatContent":"${meal.totalFat}",
              "proteinContent":"${meal.protein}",
              "carbohydrateContent":"${meal.totalCarbohydrates}"
            }
            }
            `
              )}
       ]
        }
        `
        )}
      ]
    }
    `,
    };
  };

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

      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={addJsonLdMenu()}
        />
  <script src="https://the.gatekeeperconsent.com/cmp.min.js" async data-cfasync="false"></script>
      </Head>

      <Layout>
        <main className="flex bg-stone-100 md:bg-white">
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
            />
            {/* <!-- Ezoic - sidebar_left_top - sidebar --> */}
<div id="ezoic-pub-ad-placeholder-103"> </div>
{/* <!-- End Ezoic - sidebar_left_top - sidebar --> */}
            <AsideFilterByUmbrellaCategories
              umbrellaCategories={umbrellaCategories}
              setUmbrellaCategories={setUmbrellaCategories}
            />
            <AsideAllergens
              allergens={allergens}
              setAllergens={setAllergens}
              handleAllergens={handleAllergens}
            />
            {/* <!-- Ezoic - sidebar_left_middle - sidebar_middle --> */}
<div id="ezoic-pub-ad-placeholder-104"> </div>
{/* <!-- End Ezoic - sidebar_left_middle - sidebar_middle --> */}
            <AsideTopRestaurants restaurants={restaurants} />
          </aside>
          {/* <!-- Ezoic - sidebar_floating_1 - sidebar_floating_1 --> */}
<div id="ezoic-pub-ad-placeholder-105"> </div>
{/* <!-- End Ezoic - sidebar_floating_1 - sidebar_floating_1 --> */}
          <article className="w-full">
          {/* <!-- Ezoic - top_of_page - top_of_page --> */}
          <div id="ezoic-pub-ad-placeholder-102"> </div>
          {/* <!-- End Ezoic - top_of_page - top_of_page --> */}
            <RestaurantSectionHeader
              pages={pages}
              entity={restaurant}
              titleBlack={restaurant.name}
              titleGray={` Nutrition Facts and Calories`}
            />
            <Tabs activeTab="all" slug={`/${restaurant.slug}`} />
            <RestaurantSectionTextBlock>
              <ReactMarkdown className="article-container max-w-2xl   ">
                {`Looking for ${restaurant.name} nutrition facts or ${restaurant.name} calorie info? We've crunched the data on protein, carbs, fat, and other macronutrients for every item on the ${restaurant.name} menu, so you can sort through and filter results based on your dietary needs.
`}
              </ReactMarkdown>
            </RestaurantSectionTextBlock>
            {/* <!-- Ezoic - under_page_title - under_page_title --> */}
              <div id="ezoic-pub-ad-placeholder-106"> </div>
              {/* <!-- End Ezoic - under_page_title - under_page_title --> */}
            <RestaurantSectionCategories
              categories={categoriesWithParents}
              restaurant={restaurant}
            />
            <div ref={scrollRef}/>
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

              scrollRef = {scrollRef}
            />
 <Suspense fallback={`Loading...`}>
 {/* <!-- Ezoic - under_first_paragraph - under_first_paragraph --> */}
<div id="ezoic-pub-ad-placeholder-107"> </div>
{/* <!-- End Ezoic - under_first_paragraph - under_first_paragraph --> */}
            <DynamicMeals
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
            />
           
    </Suspense>
            <FAQ faqs={faqs}/>
          </article>
          <div id="ezoic-pub-ad-placeholder-119"> </div>
        </main>
        <EmailSignup />
      </Layout>
    </>
  );
}
