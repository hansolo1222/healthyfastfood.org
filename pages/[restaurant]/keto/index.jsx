import Head from "next/head";
import Image from "next/image";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import { useSortableData } from "../../../components/UseSortableData";
import Link from "next/link";
import { useRouter } from "next/router";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import prisma from "../../../lib/prisma";
import { NextSeo } from "next-seo";
import { Tabs } from "../../../components/Tabs";
import {
  classNames,
  getCustomNutritionRowInfo,
  getUmbrellaCategory,
} from "../../../components/utils";
import { AsideFilterByCalories } from "../../../components/AsideFilterByCalories";
import { AsideFilterByUmbrellaCategories } from "../../../components/AsideFilterByUmbrellaCategory";
import { AsideAllergens } from "../../../components/AsideAllergens";
import { AsideTopRestaurants } from "../../../components/AsideTopRestaurants";
import { FilterThematicFilter } from "../../../components/FilterThematicFilter";
import { KetoTableHeaders, KetoTableMealRow } from "../../../components/TableMealRow";
import Select from "react-select";
import { ShareIcons } from "../../../components/ShareIcons";
import { Slider } from "@mui/material";
import ReactMarkdown from "react-markdown";

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

  const groupedMeals = await prisma.meal.groupBy({
    by: ["categoryName"],
    where: {
      restaurant: {
        slug: String(context.params?.restaurant),
      },
    },
  });

  if (!restaurant) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      restaurant: JSON.parse(JSON.stringify(restaurant)),
      restaurants: JSON.parse(JSON.stringify(restaurants)),
      groupedMeals: JSON.parse(JSON.stringify(groupedMeals)),
    },
  };
};

export default function Restaurant(props) {
  const router = useRouter();

  const { restaurant, restaurants, groupedMeals } = props;

  const pages = [
    { name: "All Restaurants", href: `/restaurants` },
    { name: restaurant.name, href: `/${restaurant.slug}` },
    { name: "Keto Menu", href: `/${restaurant.slug}/keto` },
  ];

  // format meals with variants
  let meals = restaurant.meals.map((meal) => {
    if (meal.variants.length > 0) {
      if (meal.variants[0].subvariants.length > 0) {
        let fullName = `${meal.name} (${meal.variants[0].variantName}) (${meal.variants[0].subvariants[0].subvariantName})`;
        return {
          ...meal,
          ...meal.variants[0].subvariants[0],
          name: fullName,
        };
      } else {
        let fullName = `${meal.name} (${meal.variants[1].variantName})`;
        return {
          ...meal,
          ...meal.variants[1],
          name: fullName,
          variantName: meal.variants[1].variantName,
        };
      }
    } else return meal;
  });

  meals = meals.map((meal) => {
    return { ...meal, categoryName: meal.category.name, netCarbohydrates: meal.totalCarbohydrates - meal.dietaryFiber };
  });

  let categories = [...new Set(meals.map((item) => item.category.name))];

  let categoriesWithParents = meals
    .map((item) => ({
      categoryName: item.category.name,
      parentCategory: item.category.parentCategory.name,
      parentCategorySlug: item.category.parentCategory.slug,

    }))
    .filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.categoryName === value.categoryName &&
            t.parentCategory === value.parentCategory
        )
    );

    let parentCategories = categoriesWithParents.map((category)=>category.parentCategorySlug)

  categoriesWithParents.sort((a, b) => {
    if (
      getUmbrellaCategory(a.parentCategory) ==
      getUmbrellaCategory(b.parentCategory)
    ) {
      return 0;
    } else if (getUmbrellaCategory(a.parentCategory) === "food") {
      console.log(
        getUmbrellaCategory(a.parentCategory),
        getUmbrellaCategory(b.parentCategory)
      );
      return -1;
    }
  });

  const [mealData, setMealData] = useState(meals);

  const [filters, setFilters] = useState([]);
  const [umbrellaCategories, setUmbrellaCategories] = useState([
    "food",
    "beverage",
  ]);
  const [allergens, setAllergens] = useState([]);

  const [minCalories, setMinCalories] = useState(0);
  const [maxCalories, setMaxCalories] = useState(2000);

  const [thematicFilter, setThematicFilter] = useState();
  const [showCustomRow, setShowCustomRow] = useState(false);

  let [netCarbLimit, setNetCarbLimit] = useState(20)


  const handleFilter = (filter) => {
    setFilters(filter);
    // filters.includes(filter)
    //   ? setFilters(filters.filter((value) => value !== filter))
    //   : setFilters(filters.concat(filter));
  };

  const handleUmbrellaCategories = (e) => {
    let filter = e.target.id;
    umbrellaCategories.includes(filter)
      ? setUmbrellaCategories(
          umbrellaCategories.filter((value) => value !== filter)
        )
      : setUmbrellaCategories(umbrellaCategories.concat(filter));
  };

  const handleThematicFilter = (event) => {
    let inputted = event.target.value;
    if (thematicFilter == inputted) {
      setThematicFilter(null);
      setShowCustomRow(false);
    } else {
      setThematicFilter(event.target.value);
      setShowCustomRow(true);
    }
  };

  const handleAllergens = (event) => {
    let allergen = event.target.id;
    allergens.includes(allergen)
      ? setAllergens(allergens.filter((value) => value !== allergen))
      : setAllergens(allergens.concat(allergen));
  };

  const handleSetMaxCalories = (event) => {
    setMinCalories(0);
    setMaxCalories(event.target.value);
  };

  const handleSetMinCalories = (event) => {
    setMinCalories(event.target.value);
    setMaxCalories(5000);
  };

  useEffect(() => {
    setMealData(
      filteredItems(
        meals.map((m) => {
          return {
            ...m,
            [thematicFilter]: calculateCustomNutrition(thematicFilter, m),
          };
        })
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
    netCarbLimit
  ]);

  const calculateCustomNutrition = (thematicFilter, m) => {
    if (thematicFilter == "highProtein") {
      return m.calories == 0 ? 0 : (m.protein / m.calories).toFixed(3);
    } else if (thematicFilter == "lowCarb") {
      return m.calories == 0
        ? 0
        : (m.totalCarbohydrates / m.calories).toFixed(3);
    } else if (thematicFilter == "lowSodium") {
      return m.calories == 0 ? 0 : (m.sodium / m.calories).toFixed(3);
    } else if (thematicFilter == "lowCholesterol") {
      return m.calories == 0 ? 0 : (m.cholesterol / m.calories).toFixed(3);
    }
  };

  const filteredItems = (items) =>
    items
    .filter((item) => item.netCarbohydrates < netCarbLimit)
      .filter(
        (item) => item.calories >= minCalories && item.calories <= maxCalories
      )
      .filter((item) => {
        if (filters.length == 0) {
          return true;
        } else {
          return categories
            .map((c) => {
              return filters.includes(c) && item.category.name === c;
            })
            .includes(true);
        }
      })
      .filter((item) => {
        return umbrellaCategories.includes(
          getUmbrellaCategory(item.category.parentCategory.name)
        );
      })
      .filter((item) => {
        if (allergens.length == 0) {
          return true;
        } else {
          return !allergens
            .map((allergen) => {
              return item.allergensFalse.includes(allergen);
            })
            .includes(false);
        }
      });

  let {
    items,
    requestSort,
    requestSortPreserveDirection,
    sortConfig,
    SortableTableHeader,
    SortableTableHeaderInverse,
    SortableTableHeaderROI,
  } = useSortableData(mealData, {
    key: "netCarbohydrates",
    direction: "ascending",
  });

  //--------------------------- MOBILE FILTERS ---------------------------

  const handleSetMaxCaloriesMobile = (event) => {
    if (event !== null) {
      setMaxCalories(event.value);
    } else {
      setMaxCalories(10000);
    }
  };

  const handleNetCarbLimitChange = (event) => {
    setNetCarbLimit(event.target.value)
  };

  const [showCalorieFilter, setShowCalorieFilter] = useState(false);
  const handleCalorieFilter = () => setCalorieFilter(true);

  const allergenOptions = [
    { value: "gluten", label: "Gluten Free" },
    { value: "milk", label: "Dairy Free" },
    { value: "peanuts", label: "No Peanuts" },
    { value: "eggs", label: "No Eggs" },
    { value: "wheat", label: "No Wheat" },
    { value: "soy", label: "No Soy" },
    { value: "tree nuts", label: "No Tree Nuts" },
    { value: "fish", label: "No Fish" },
    { value: "shellfish", label: "No Shellfish" },
  ];

  const calorieOptions = [
    { value: 100, label: "Under 100cal" },
    { value: 300, label: "Under 300cal" },
    { value: 500, label: "Under 500cal" },
    { value: 800, label: "Under 800cal" },
  ];

const marks = [

  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 40,
    label: '40',
  },
  {
    value: 50,
    label: '50',
  },
]

console.log(categories.map((cat)=>(cat)))

  return (
    <div className="">
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
            "Everything Keto at " + restaurant.name +
            " in 2022 - HealthyFastFood",
          description:
            restaurant.name + " has a ton of options if you're trying to stick to a keto diet",
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
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex">
          <aside className="hidden lg:block shrink-0 pb-10 w-56 pr-8">
            <AsideFilterByCalories
              handleSetMaxCalories={handleSetMaxCalories}
              handleSetMinCalories={handleSetMinCalories}
            />
            <AsideFilterByUmbrellaCategories
              umbrellaCategories={umbrellaCategories}
              handleUmbrellaCategories={handleUmbrellaCategories}
            />
            <AsideAllergens
              allergens={allergens}
              handleAllergens={handleAllergens}
            />
            <AsideTopRestaurants restaurants={restaurants} />
          </aside>
          <main className="mt-4 md:mt-8 w-full">
            <div className="block md:hidden mb-2">
              <Breadcrumbs pages={pages} className="" />
            </div>
            <div className="flex items-center md:items-center">
              <div className="relative w-6 h-6 md:w-12 md:h-12 mr-2 md:mr-4">
                <Image
                  className=" flex-shrink-0 rounded-md mr-2 z-0"
                  src={`/images/logosSmall/${restaurant.slug}.webp`}
                  alt={`${restaurant.name} Logo`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div>
                <div className="hidden md:block">
                  <Breadcrumbs pages={pages} className="" />
                </div>
                <h1 className="text-lg md:text-xl lg:text-3xl font-bold mt-1">
                  
                 
                  Everything Keto at{" "}{restaurant.name}
                </h1>
              </div>
            </div>
           
            

            <div className="mt-4">
              <Tabs activeTab="keto" slug={`/${restaurant.slug}`} />
            </div>

            <div className=" mt-4 mb-4">

            <ReactMarkdown className="article-container max-w-2xl">

          {
`## Staying Ketogenic At ${restaurant.name}

Eating out on a ketogenic diet can be tough! That’s why we’ve crunched official data from ${restaurant.name} and created a tool that shows keto-friendly items in every category:

${categories.map((cat)=>(`[${cat}](${"slug"})` + ' '  ))}

Keep in mind we’re using **20g net carbs as the maximum for keto-friendly options**. This exact number will vary depending on your body and dietary requirements so you can customize it below:

`
}


            </ReactMarkdown>
            
          
            </div>

<div className="hidden md:block mb-8">
<div className="max-w-2xl bg-blue-50 text-blue-500 rounded-lg p-4">
<h3 className="text-lg font-semibold pb-2">Net Carbohydrate Limit</h3>
 <Slider
  aria-label="Net carbohydrate limit"
  defaultValue={20}
  onChange={handleNetCarbLimitChange}
  marks={marks}
  min={0}
  max={60}
  valueLabelDisplay="auto" f
/>
</div>
{/* <div className="">
              <FilterThematicFilter
                thematicFilter={thematicFilter}
                handleThematicFilter={handleThematicFilter}
              />
            </div> */}
</div>
            

            <div className="md:hidden sticky top-0 bg-white z-40 pb-2 border-b">
              <div className="pt-2">
                <h3 className="text-xs font-semibold uppercase text-blue-500 pb-2">Net Carbohydrate Limit</h3>
                <Slider
                  aria-label="Net carbohydrate limit"
                  defaultValue={20}
                  onChange={handleNetCarbLimitChange}
                  marks={marks}
                  min={0}
                  max={50}
                  valueLabelDisplay="auto"
                />
              </div>
              {/* <FilterThematicFilter
                thematicFilter={thematicFilter}
                handleThematicFilter={handleThematicFilter}
              /> */}
              <div className="">
                <h3 className="text-xs font-semibold uppercase pb-2">Filter</h3>
                <div className="flex space-x-2">
                  {/*  Custom job here, is it worth it?
                
                <button
                onClick={() => setShowCalorieFilter(!showCalorieFilter)}
                className="text-sm text-stone-700 peer border py-1 px-2 rounded-full flex items-center">
                  Calories <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />

                </button> */}
                  {/* {showCalorieFilter && 
                <div
                  className="hidden peer-hover:flex hover:flex border
                w-[230px]
                flex-col bg-white drop-shadow-md top-10 absolute z-50 rounded-lg p-3"
                >
                  <AsideFilterByCalories
                    handleSetMaxCalories={handleSetMaxCalories}
                    handleSetMinCalories={handleSetMinCalories}
                  />
                </div>
                } */}
                  <Select
                    options={calorieOptions}
                    isClearable={true}
                    placeholder="By Calories"
                    onChange={handleSetMaxCaloriesMobile}
                  />
                  {/* <div className="text-sm text-stone-700 peer border py-1 px-2 rounded-full flex items-center">
                  Allergens <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                </div> */}
                  <Select
                    options={allergenOptions}
                    isMulti
                    placeholder="+ Allergies"
                    onChange={setAllergens}
                  />
                </div>
              </div>
            </div>

            <article className="overflow-x-auto w-full z-10">
              {categoriesWithParents
                .filter((cat) =>
                  umbrellaCategories.includes(
                    getUmbrellaCategory(cat.parentCategory)
                  )
                )
                .map((cat, i) => {
                  return (
                    <div
                      className="md:border shadow-sm mb-6 rounded-md overflow-hidden"
                      key={cat.categoryName}
                    >
                      <div className="py-3 md:mx-3 font-semibold border-b">
                        {cat.categoryName}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="divide-y divide-stone-300 rounded-lg w-full  md:table-fixed ">
                          <thead className="rounded-t-lg">
                            {/* <tr className="bg-stone-800 text-white w-full pl-2">{group.categoryName}</tr> */}
                            <KetoTableHeaders
                              showCustomRow={showCustomRow}
                              thematicFilter={thematicFilter}
                              SortableTableHeader={SortableTableHeader}
                            />
                          </thead>
                          <tbody className="divide-y divide-stone-200 bg-white w-full">
                            {items.filter(
                              (i) => i.categoryName == cat.categoryName
                            ).length > 0 ? (
                              items
                                .filter(
                                  (i) => i.categoryName == cat.categoryName
                                )
                                .map((meal) => (
                                  <KetoTableMealRow
                                    restaurantName={restaurant.name}
                                    restaurantSlug={restaurant.slug}
                                    showRestaurantData={false}
                                    meal={meal}
                                    key={meal.mealName}
                                    showCustomRow={showCustomRow}
                                    customRowKey={thematicFilter}
                                    customRowUnits={
                                      getCustomNutritionRowInfo(thematicFilter)
                                        .units
                                    }
                                  />
                                ))
                            ) : (
                              <tr className="">
                                <td
                                  colSpan={8}
                                  className="single-cell-row text-md text-stone-500 text-center p-8"
                                >
                                  No items found!
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              
            </article>
            <ReactMarkdown className="article-container max-w-2xl">
            {


`
## The basics of ordering Keto at ${restaurant.name}

${parentCategories.includes(`burgers-sandwiches`) ? "- Your best bet is to get a bunless and sauceless burger, then just ask for yellow mustard, mayo or ranch on the side." : ""}

## How to use this tool
Keto doesn’t necessarily mean zero carbs.  A keto diet typically limits  total carb intake to less than 50 grams per day—’strict’ keto can be as low as 20 grams a day. [[Source](https://www.hsph.harvard.edu/nutritionsource/healthy-weight/diet-reviews/ketogenic-diet/#:~:text=The%20ketogenic%20diet%20typically%20reduces,and%2010%2D20%25%20protein.)]

People doing a keto diet typically use net carbs for their carbohydrate limit. Net carbs equal total carbs minus fiber, because the carbs in fiber are not digested and don’t cause the blood sugar increase that knocks you out of netosis. <sup>[[Source]()]

We’ve made a tool that lets you filter ${restaurant.name} menu items by net carbs. By default, this tool will show menu items under 20g of net carbs. Everybody has a different ketosis threshold, but most people will need to get under 50g net carbs to reach ketosis. The general advice is to start with 50g, and go lower if your body is not reaching ketosis.

If you’re trying to eat a low-carb diet rather than a keto diet, we recommend you check out the [Low-carb menu items at ${restaurant.name}]("low-carb"). This will have different results from keto, but is much less than the amount of carbs in the standard Western diet.

If you have a gluten allergen, you can take a look at [Gluten-Free Options at ${restaurant.name}]("gluten-free").

## What Restaurants are Keto Friendly?

If you’re new to keto, you might be struggling with adjusting to your new way of eating. If you’re used to eating out, this makes it even harder when you’re scared something might have more carbs than you expect. 

Luckily in the past 10 years, keto has gone from a niche diet to claiming a position as a popular mainstream diet. More and more restaurants are beginning to cater to those following a keto diet. Here are some our recommendations:

### Chipotle

One of the most popular fast-casual restaurants, Chipotle offers a variety of keto-friendly options. For your entrée, you can choose from a chicken, steak, or carnitas burrito bowl with lettuce, cheese, sour cream, and guacamole. Just be sure to skip the rice and beans.

### Chick-fil-A

Chick-fil-A is another great option for those following a keto diet. For your main entrée, you can choose from a grilled chicken sandwich (without the bun of course), grilled nuggets, or a Cobb salad. And don’t forget to add a side of avocado ranch dressing – it’s delicious!

### Panera Bread

Panera Bread is a great place to go for a quick and healthy meal. For your main entrée, you can choose from a variety of salads, including the popular Greek salad and the chicken Caesar salad. Just be sure to ask for no croutons and skip the bread.

### P.F. Chang’s

P.F. Chang’s is a great option if you’re looking for something a little more filling. For your main entrée, you can choose from a variety of chicken, steak, and shrimp dishes. Just be sure to ask for no rice.

### Red Robin

Red Robin is a great place to go if you’re looking for a burger. For your main entrée, you can choose from a variety of burgers, including the popular “Gourmet Cheeseburger” and the “Strawberry Limeade Burger.” Just be sure to skip the bun and fries.

### Texas Roadhouse

Texas Roadhouse is the classic place to go when you’re craving a steak. For your main entrée, you can choose from a variety of steak, chicken, and shrimp dishes. As long as you don’t get rice you are eating very keto-friendly!

These are just a few of the many keto-friendly restaurants that are out there. Next time you’re feeling hungry, you can rest assured that you’ll be able to find a delicious and keto-friendly meal.

On our [Every Keto Option At Every Fast Food Chain Index](/keto), we have keto options at restaurant!
`
}

            </ReactMarkdown>
          </main>
        </div>
      </Layout>
    </div>
  );
}
