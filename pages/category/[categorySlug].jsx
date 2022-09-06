// import Head from "next/head";
// import Image from "next/image";
// import Layout from "../../components/Layout";
// import { useEffect, useState } from "react";
// import { useSortableData } from "../../components/UseSortableData";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { Breadcrumbs } from "../../components/Breadcrumbs";
// import prisma from "../../lib/prisma";
// import { NextSeo } from "next-seo";
// import { FoodCategoryTabs } from "../../components/Tabs";
// import {
//   classNames,
//   getCustomNutritionRowInfo,
//   getUmbrellaCategory,
// } from "../../components/utils";
// import { AsideCalorieFilter } from "../../components/AsideFilterByCalories";
// import { AsideFilterByUmbrellaCategories } from "../../components/AsideFilterByUmbrellaCategory";
// import { AsideAllergens } from "../../components/AsideAllergens";
// import { AsideTopRestaurants } from "../../components/AsideTopRestaurants";
// import { FilterThematicFilter } from "../../components/FilterThematicFilter";
// import { TableHeaders, TableMealRow, formatParentCategory } from "../../components/TableMealRow";

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
import _ from "lodash";

import dynamic from "next/dynamic";
import { Suspense } from "react";


const DynamicMeals = dynamic(() => import('../../components/RestaurantSectionMeals'), {
  suspense: true,
})


export const getStaticProps = async (context) => {
  const parent = await prisma.parentCategory.findUnique({
    where: {
      slug: String(context.params?.categorySlug),
    },
    include: {
      categories: {
        include: {
          meals: {
            include: {
              restaurant: true,
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
        },
      },
    },
  });

  const parentCategories = await prisma.parentCategory.findMany();

  const restaurants = await prisma.restaurant.findMany({
    orderBy: [
      {
        rank: "asc",
      },
    ],
  });

  return {
    props: {
      category: JSON.parse(JSON.stringify(parent)),
      parentCategories: JSON.parse(JSON.stringify(parentCategories)),
      restaurants: JSON.parse(JSON.stringify(restaurants)),
    },
  };
};

export async function getStaticPaths() {
  const parentCategories = await prisma.parentCategory.findMany();

  // Get the paths we want to pre-render based on posts
  const paths = parentCategories.map((category) => ({
    params: { categorySlug: category.slug },
  }));

  // We'll pre-render only these paths at build time.
  return { paths, fallback: false };
}




export default function Category(props) {
  let { category, parentCategories, restaurants } = props;

  let restaurant={name:"e",}

  let meals = formatMealsWithVariants(
    category.categories.flatMap((cat) => cat.meals)
  );

  // let categories = [...new Set(meals.map((item) => item.category.name))];

  const pages = [
    { name: "Categories", href: `/category` },
    { name: category.name, href: `/category/${category.slug}` },
  ];

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

  console.log(lowestCalories);
  // .sort(function(a,b){
  //   if (a.meals[0].category.parentCategorySlug == 'burgers-sandwiches'){
  //     return -1
  //   }

  //       const textA = a.categoryName;
  //       const textB = b.categoryName;
  //       return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  //     })
  // Here I have to implement my own sort. Idea is if it falls under Burgers & Sandwiches (parentCategory) it should go first

  return (
    <>
      <NextSeo
        title={`Nutrition Facts and Calories | Healthy Fast Food`}
        description={`Discover nutrition facts, macros, and the healthiest items at ${category.name}`}
        canonical={`https://healthyfastfood.org/category/${category.slug}`}
        additionalMetaTags={[
          {
            property: "keywords",
            content: `${category.slug},nutrition,facts,`,
          },
        ]}
        openGraph={{
          url: "https://healthyfastfood.org/" + category.slug,
          type: "website",
          title: category.name + " | Healthy Fast Food",
          description:
            "Discover nutrition facts, macros, and the healthiest items at " +
            category.name,
          images: [
            {
              url: `/images/restaurant_logos/${category.slug}.webp`,
              width: 400,
              height: 400,
              alt: category.name + " Logo",
            },
          ],
        }}
        twitter={{
          handle: "@healthyfastfood",
          site: "https://healthyfastfood.org",
          cardType: "summary_large_image",
        }}
      />
      <Head></Head>
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
              entity={category}
              titleBlack={`Ranking ${category.name} at Restaurants by Nutrition`}
              titleGray={``}
              emoji
            />
            {/* <Tabs activeTab="all" slug={`/${restaurant.slug}`} /> */}
            {/* <RestaurantSectionTextBlock>
              <ReactMarkdown className="article-container max-w-2xl   ">
                {`Looking for ${restaurant.name} ßnutrition facts or ${restaurant.name} calorie info? We've crunched the data on protein, carbs, fat, and other macronutrients for every item on the ${restaurant.name} menu, so you can sort through and filter results based on your dietary needs.
`}
              </ReactMarkdown>
            </RestaurantSectionTextBlock> */}
            {/* <RestaurantSectionCategories
              categories={categoriesWithParents}
              restaurant={restaurant}
            /> */}
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
            />
            <Suspense fallback={`Loading...`}>
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
                showRestaurantData={true}
                group={false}
              />
            </Suspense>
            {/* <FAQ faqs={faqs} /> */}
          </article>
        </main>
        <EmailSignup />
      </Layout>
    </>
  );
}
