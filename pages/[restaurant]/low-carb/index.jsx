import Head from "next/head";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import { useSortableData } from "../../../components/UseSortableData";
import prisma from "../../../lib/prisma";
import { NextSeo } from "next-seo";
import { Tabs } from "../../../components/Tabs";
import {
  calculateCustomNutrition,
  getCustomNutritionRowInfo,
  getUmbrellaCategory,
  handleAllergens,
  filterItems,
  formatMealsWithVariants,
  getCategoriesWithParentsFromMeals,
  sortCategories,
} from "../../../components/utils";
import { AsideCalorieFilter } from "../../../components/AsideFilterByCalories";
import { AsideFilterByUmbrellaCategories } from "../../../components/AsideFilterByUmbrellaCategory";
import { AsideAllergens } from "../../../components/AsideAllergens";
import { AsideTopRestaurants } from "../../../components/AsideTopRestaurants";
import { RestaurantSectionHeader } from "../../../components/RestaurantSectionHeader";
import { RestaurantSectionCategories } from "../../../components/RestaurantSectionCategories";
import { RestaurantSectionDesktopThematicSort } from "../../../components/RestaurantSectionDesktopThematicSort";
import { RestaurantSectionMobileFilter } from "../../../components/RestaurantSectionMobileFilter";
import { RestaurantSectionTextBlock } from "../../../components/RestaurantSectionTextBlock";
import RestaurantSectionMeals from "../../../components/RestaurantSectionMeals";
import EmailSignup from "../../../components/EmailSignup";
import ReactMarkdown from "react-markdown";
import { FAQ } from "../../../components/FAQ";
// KETO ONLY
import { Slider } from "@mui/material";
import _ from 'lodash';

import {
  KetoTableHeaders,
  KetoTableMealRow,
} from "../../../components/TableMealRow";
export const getServerSideProps = async (context) => {
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
      restaurantType: true,
    },
  });
  if (!restaurant) {
    return {
      notFound: true,
    };
  }

  const restaurantType = restaurant.restaurantType.slug;

  const restaurants = await prisma.restaurant.findMany({
    where: {
      restaurantType: {
        slug: restaurantType,
      },
    },
    orderBy: [
      {
        rank: "asc",
      },
    ],
  });

  return {
    props: {
      restaurant: JSON.parse(JSON.stringify(restaurant)),
      restaurants: JSON.parse(JSON.stringify(restaurants)),
      restaurantType: JSON.parse(JSON.stringify(restaurantType)),
    },
  };
};

export default function RestaurantKetoMenu(props) {
  const { restaurant, restaurants, restaurantType } = props;

  const pages = [
    { name: "All Restaurants", href: `/restaurants` },
    { name: restaurant.name, href: `/${restaurant.slug}` },
    { name: "Low-Carb Menu", href: `/${restaurant.slug}/low-carb` },
  ];

  // format meals with variants
  let meals = formatMealsWithVariants(restaurant.meals);

  const categoriesWithParents = sortCategories(
    getCategoriesWithParentsFromMeals(meals)
  );

  //----------------------------- KETO ONLY -----------------------------
  meals = meals.map((meal) => {
    return {
      ...meal,
      categoryName: meal.category.name,
      netCarbohydrates: meal.totalCarbohydrates - meal.dietaryFiber,
    };
  });

  let [netCarbLimit, setNetCarbLimit] = useState(40);

  const handleNetCarbLimitChange = (event) => {
    setNetCarbLimit(event.target.value);
  };

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

  // Mobile only
  const [showCalorieFilter, setShowCalorieFilter] = useState(false);

  //--------------------RELOAD EVERY TIME A FILTER IS USED----------------------

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
        maxCalories,
        {name:"keto",limit:netCarbLimit}
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
    netCarbLimit,
  ]);

  //--------------------------- FILTER & SORT ---------------------------

  let { items, requestSort, SortableTableHeader } = useSortableData(mealData, {
    key: "netCarbohydrates",
    direction: "ascending",
  });

  //--------------------------- FAQ ---------------------------

  const faqs = [
    {
      question: `Should I do a Low Carb Diet or a Keto Diet?`,
      answer: ` 
        A keto diet is much more restrictive than a low-carb one, which will greatly restrict your options when eating at ${restaurants.name}. Keto is harder to transition into, however you may also notice side-effects when switching to a low-carb diet. If your goal is to build muscle, then going low-carb could be the better option, because glucose is required for muscle repair.

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
    "url": "https://healthyfastfood.org/${restaurant.name}/low-carb",
    "mainEntityOfPage": "https://healthyfastfood.org/${restaurant.name}/low-carb",
    "inLanguage":"English",
    "description":"The Low-Carb Menu at ${restaurant.name}",
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
        "name":"${meal.name}",
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
  

  const marks = [
    {
      value: 10,
      label: "10",
    },
    {
      value: 20,
      label: "20",
    },
    {
      value: 30,
      label: "30",
    },
    {
      value: 40,
      label: "40",
    },
    {
      value: 50,
      label: "50",
    },
    {
      value: 60,
      label: "60",
    },
    {
      value: 70,
      label: "70",
    },
    {
      value: 80,
      label: "80",
    },
    {
      value: 90,
      label: "90",
    },
    {
      value: 100,
      label: "100",
    },
    {
      value: 110,
      label: "110",
    },
    {
      value: 120,
      label: "120",
    },
    {
      value: 130,
      label: "130",
    },
    {
      value: 140,
      label: "140",
    },
  ];

  return (
    <>
      <NextSeo
        title={`All Low-Carb Options at ${restaurant.name} in 2022 - HealthyFastFood`}
        description={`It's hard to eat low-carb when you're eating out. That's why we've analyzed the data and created this interactive list of low-carb options at ${restaurant.name}`}
        canonical={`https://healthyfastfood.org/${restaurant.slug}/low-carb`}
        additionalMetaTags={[
          {
            property: "keywords",
            content: `${restaurant.slug},nutrition,facts,keto,ketogenic,low carb,diet,carbohydrates,weight loss`,
          },
        ]}
        openGraph={{
          url: "https://healthyfastfood.org/" + restaurant.slug + "/low-carb",
          type: "website",
          title:
            "All Low-Carb Options at " +
            restaurant.name +
            " in 2022 - HealthyFastFood",
          description:
            restaurant.name +
            " has a ton of options if you're trying to stick to a low-carb diet. We've made an interactive list of all of them.",
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
              restaurant={restaurant}
              titleBlack={`All Low-Carb Options at ${restaurant.name}`}
              titleGray={``}
            />
            <Tabs activeTab="low-carb" slug={`/${restaurant.slug}`} />
            <RestaurantSectionTextBlock>
              <ReactMarkdown className="article-container max-w-2xl   ">
{`
Eating out on a low-carb diet is always tricky. That’s why we’ve crunched the official data and put together this list of ${restaurant.name} low-carb options. 

**What counts at low-carb?** There's no strict definition; some people use 50g net carbs as their daily maximum, others use 100g net carbs. Compare this to the average American/western diet of 175-250g net carbs per day. This allows for a lot more foods than [keto](/${restaurant.slug}/keto).

As a default we're using **35g net carbohydrates** as the maximum for a low-carb meal. You can adjust this according to your dietary needs
`}
              </ReactMarkdown>
            </RestaurantSectionTextBlock>

            {/* <RestaurantSectionCategories
              categories={categoriesWithParents}
              restaurant={restaurant}
            /> */}
            {/* <RestaurantSectionDesktopThematicSort
              thematicFilter={thematicFilter}
              setThematicFilter={setThematicFilter}
              setShowCustomRow={setShowCustomRow}
            /> */}
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

              netCarbLimit={netCarbLimit}
              netCarbMax={150}
              handleNetCarbLimitChange={handleNetCarbLimitChange}
              marks={marks}
            />

            <div className="hidden md:block mb-8">
              <div className="max-w-2xl bg-blue-50 text-blue-500 rounded-lg p-4">
                <h3 className="text-lg font-semibold pb-2">
                  Net Carbohydrate Limit
                </h3>
                <Slider
                  aria-label="Net carbohydrate limit"
                  defaultValue={netCarbLimit}
                  onChange={handleNetCarbLimitChange}
                  marks={marks}
                  min={0}
                  max={150}
                  valueLabelDisplay="auto"
                  f
                />
              </div>
            </div>
            
            <RestaurantSectionMeals
              restaurant={restaurant}
              categoriesWithParents={categoriesWithParents}
              showCustomRow={showCustomRow}
              thematicFilter={thematicFilter}
              SortableTableHeader={SortableTableHeader}
              umbrellaCategories={umbrellaCategories}
              getUmbrellaCategory={getUmbrellaCategory}
              items={items}
              variant="keto"
            />
          

            {/* ${
  parentCategories.includes(`burgers-sandwiches`)
    ? "- Your best bet is to get a bunless and sauceless burger, then just ask for yellow mustard, mayo or ranch on the side."
    : ""
} */}
            <RestaurantSectionTextBlock>
            <ReactMarkdown className="article-container max-w-2xl">
              {`
## The basics of ordering Low-Carb at ${restaurant.name}



## How to use this tool

This tool allows you to filter through ${restaurant.name} options by net carbs. Net carbs equal **total carbs minus fiber** and are used by people tracking carbohydrates in their diets. Net carbs is used instead of total carbs, because the carbs in fiber are not digested and don't cause the insulin reponse of regular carbs [[Source](https://www.hsph.harvard.edu/nutritionsource/healthy-weight/diet-reviews/ketogenic-diet/#:~:text=The%20ketogenic%20diet%20typically%20reduces,and%2010%2D20%25%20protein.)].

## Why a Low-Carb Diet?

There is a lot of scientific evidence that a low-carb diet may help people lose weight more quickly than a low-fat diet [[Source](https://www.hsph.harvard.edu/nutritionsource/carbohydrates/low-carbohydrate-diets/)]. Low carb diets also result in lower risk of heart disease and lower risk of type 2 diabetes, as well as lower blood pressure.

`}
            </ReactMarkdown>
            </RestaurantSectionTextBlock>
            <FAQ faqs={faqs} />
          </article>
        </main>
        <EmailSignup />
      </Layout>
    </>
  );
}
