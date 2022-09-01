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
import  RestaurantSectionMeals  from "../../../components/RestaurantSectionMeals";
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
    { name: "Keto Menu", href: `/${restaurant.slug}/keto` },
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

  let [netCarbLimit, setNetCarbLimit] = useState(20);

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
      question: `How do I know how many carbs to eat on a ketogenic diet?`,
      answer: ` 
        This is a common question; the answer will vary from person to person. Some people can eat 50g net carbs and maintain ketosis. Other people can't go over 25 without breaking ketosis (however this is more rare).

        The point of keeping net carbs lower (say around 25g) is to get you into ketosis faster and help you adapt faster.

        Keep in mind that higher activity levels mean you can go higher without breaking ketosis. This is because highly active people will have higher muscle insulin sensitivity, which will help take up glucose from the blood instead of it interrupting ketosis.
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
    "url": "https://healthyfastfood.org/${restaurant.name}/keto",
    "mainEntityOfPage": "https://healthyfastfood.org/${restaurant.name}/keto",
    "inLanguage":"English",
    "description":"Everything Keto at ${restaurant.name}: The Complete ${restaurant.name} Keto-friendly Menu",
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
  ];

  return (
    <>
          <NextSeo
        title={`Everything Keto at ${restaurant.name} in 2022 - HealthyFastFood`}
        description={`${restaurant.name} has many options if you're trying to stick to a ketogenic diet.`}
        canonical={`https://healthyfastfood.org/${restaurant.slug}/keto`}
        additionalMetaTags={[
          {
            property: "keywords",
            content: `${restaurant.slug},nutrition,facts,keto,ketogenic,low carb,diet`,
          },
        ]}
        openGraph={{
          url: "https://healthyfastfood.org/" + restaurant.slug + "/keto",
          type: "website",
          title:
            "Everything Keto at " +
            restaurant.name +
            " in 2022 - HealthyFastFood",
          description:
            restaurant.name +
            " has a ton of options if you're trying to stick to a keto diet",
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
              titleBlack={`Everything Keto at ${restaurant.name}`}
              titleGray={``}
            />
            <Tabs activeTab="keto" slug={`/${restaurant.slug}`} />
            <RestaurantSectionTextBlock>
              <ReactMarkdown className="article-container max-w-2xl   ">
{`Eating out on a ketogenic diet can be tough! That’s why we’ve crunched the official data and put together this list of ${restaurant.name} keto options. This tool is interactive so you can change what counts 'keto-friendly' depending on your personal dietary requirements.

As a default we're using **20g net carbohydrates** as the maximum for keto-friendly options. People eating on a ketogenic diet will track a food's net carbs, which is equal to total carbs minus fiber.

For foods with slightly more carbs you might be interested in [low-carb options at ${restaurant.name}](/${restaurant.slug}/low-carb).
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
              netCarbMax={50}
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
                  max={60}
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
## The basics of ordering Keto at ${restaurant.name}



## How to use this tool

Keto doesn’t necessarily mean zero carbs.  A keto diet typically limits net carb intake to less than 50 grams per day—stricter versions of keto can be as low as 20 grams of net carbs a day. [[Source](https://www.hsph.harvard.edu/nutritionsource/healthy-weight/diet-reviews/ketogenic-diet/#:~:text=The%20ketogenic%20diet%20typically%20reduces,and%2010%2D20%25%20protein.)]

What are net carbs and why do people doing keto count them instead of total carbs? **Net carbs equal total carbs minus fiber**, because the carbs in fiber are not digested and don’t cause the blood sugar increase that knocks you out of ketosis. [[Source](https://dtc.ucsf.edu/living-with-diabetes/diet-and-nutrition/understanding-carbohydrates/counting-carbohydrates/learning-to-read-labels/understanding-fiber/)]

We’ve made a tool that lets you filter ${restaurant.name} menu items by net carbs. By default, this tool will show menu items under 20g of net carbs. Everybody has a different ketosis threshold, but most people will need to get under **50g net carbs** to reach ketosis. General advice for people starting with this diet is to start with 50g, and go lower if your body is not reaching ketosis.

If you’re trying to eat a low-carb diet rather than a keto diet, we recommend you check out the list of [low-carb menu items at ${restaurant.name
}](/low-carb). How many carbs is low-carb? This depends on your weight, but is typically defined as less than 130g of carbohydrates per day [[Source](https://www.ncbi.nlm.nih.gov/books/NBK537084/)].

## What Restaurants are Keto Friendly?

If you’re new to keto, you might be struggling with adjusting to this new way of eating. After all, it's not just a diet change, but an entire lifestyle change for many. If you’re used to eating out, not only do you have to explain to people what you're doing, but suddenly your options seem very limited!

Luckily in the few years alone, keto has gone from a niche diet a mainstream one, with a proven track record of helping people with both weight loss, as well as blood sugar control for type 2 diabetes [[Source](https://www.health.harvard.edu/blog/ketogenic-diet-is-the-ultimate-low-carb-diet-good-for-you-2017072712089)]. 

More and more restaurants are beginning to introduce low carb options to cater to those following a keto diet. Here are some our recommendations:

### [Chipotle](https://healthyfastfood.org/chipotle)

One of the most popular fast-casual restaurants, Chipotle offers a variety of keto-friendly options. For your entrée, you can choose from a chicken, steak, or carnitas burrito bowl with lettuce, cheese, sour cream, and guacamole. Just be sure to skip the rice and beans.

### [Chick-fil-A](https://healthyfastfood.org/chick-fil-a)

Chick-fil-A is another great option for those following a keto diet. For your main entrée, you can choose from a grilled chicken sandwich (without the bun of course), grilled nuggets, or a Cobb salad. And don’t forget to add a side of avocado ranch dressing – it’s delicious!

### [Panera Bread](https://healthyfastfood.org/panera-bread)

Panera Bread is a great place to go for a quick and healthy meal. For your main entrée, you can choose from a variety of salads, including the popular Greek salad and the chicken Caesar salad. Just be sure to ask for no croutons and skip the bread.

### [P.F. Chang’s](https://healthyfastfood.org/pf-changs)

P.F. Chang’s is a great option if you’re looking for something a little more filling. For your main entrée, you can choose from a variety of chicken, steak, and shrimp dishes. Just be sure to ask for no rice.

### [Texas Roadhouse](https://healthyfastfood.org/texas-roadhouse)

Texas Roadhouse is *the* classic place to go when you’re craving a steak. For your main entrée, you can choose from a variety of steak, chicken, and shrimp dishes. As long as you don’t get rice you are eating very keto-friendly!

These are just a few of the many keto-friendly restaurants that are out there. Next time you’re feeling hungry, you can rest assured that you’ll be able to find a delicious and keto-friendly meal.

On our [Every Keto Option At Every Fast Food Chain Index](/keto), we have keto options at restaurant. Good luck, and happy ketosis!
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
