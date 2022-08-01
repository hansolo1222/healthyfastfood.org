import Head from "next/head";
import Image from "next/image";
//import styles from '../styles/Home.module.css'
import Header from "../components/Header";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useSortableData } from "../components/UseSortableData";
import { useFilteredData } from "../components/UseFilteredData";
//let glob = require( 'glob' ), path = require( 'path' );
//import recursiveReaddirFiles from 'recursive-readdir-files';
import Link from "next/link";
import { MealRow, formatCategory, formatParentCategory } from ".";
import { useRouter } from "next/router";
import { Breadcrumbs } from "../components/Breadcrumbs";
import prisma from "../lib/prisma";
import { NextSeo } from "next-seo";
import { Tabs } from "../components/Tabs";
import { Slider } from "@mui/material";
import { classNames } from "../components/utils";

export const getServerSideProps = async (context) => {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      rank: {
        lt: 13,
      },
    },
    orderBy: [
      {
        rank: "asc",
      },
    ],
  });
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
          variants: true,
        },
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
    },
  };
};

const getUmbrellaCategory = (item) => {
if ([
    "Beverages",
    "Coffee",
    "Alcohol",
    "Shakes"
  ].includes(item)) {
    return "beverage";
  } 
  else if ([
    "Dressings & Sauces",
    "Toppings"
  ].includes(item)){
    return "condiment"
  } else {

      return "food";
 
  }
}

const formatCategoryName = (category) => {
  if (
    category == "Burgers & Sandwiches" ||
    category == "Sandwiches & Burgers"
  ) {
    return "🍔 Sandwiches";
  }
  if (category == "Beverages") {
    return "🥤 Beverages";
  }
  if (category == "Breakfast") {
    return "🍳 Breakfast";
  }
  if (category == "Seafood") {
    return "🍤 Seafood";
  }
  if (category == "Breads") {
    return "🍞 Breads";
  }
  if (category == "Sauces") {
    return "🥫 Sauces";
  }

  if (category == "Chicken Nuggets and Strips") {
    return "🐔 Chicken";
  }
  if (category == "Condiments") {
    return "🧂 Condiments";
  }
  if (category == "Desserts") {
    return "🍦 Desserts";
  }
  if (category == "Happy Meals" || category == "Kids Menu") {
    return "👶 " + category;
  }
  if (category == "McCafe Coffee") {
    return "☕ Coffee";
  }
  if (category == "Menu Hacks") {
    return "🎁 Limited Edition";
  }
  if (category == "Salads") {
    return "🥗 Salads";
  }
  if (category == "Snacks & Sides" || category == "Sides") {
    return "🥔 Sides";
  } else {
    return category;
  }
};

export default function Restaurant(props) {
  const router = useRouter();

  const { restaurant, restaurants } = props;

  const pages = [
    { name: "All Restaurants", href: `/restaurants` },
    { name: restaurant.name, href: `/${restaurant.slug}` },
  ];

  // format meals with variants
  let meals = restaurant.meals.map((meal) => {
    if (meal.variants.length > 0) {
      let fullName = `${meal.name} (${meal.variants[1].variantName})`;
      return {
        ...meal,
        ...meal.variants[1],
        name: fullName,
        variantName: meal.variants[1].variantName,
      };
    } else return meal;
  });

  let categories = [...new Set(meals.map((item) => item.category.name))];

  let mealData = meals.map((m) => {
    return {
      ...m,
      proteinPerCalorie:
        m.calories == 0 ? 0 : (m.protein / m.calories).toFixed(3),
    };
  });

  const [selectedMeals, setSelectedMeals] = useState(null);

  const [filters, setFilters] = useState([]);
  const [umbrellaCategories, setUmbrellaCategories] = useState(["food","beverage"])
  const [allergens, setAllergens] = useState([]);

  const [minCalories, setMinCalories] = useState(0);
  const [maxCalories, setMaxCalories] = useState(2000);

  const [thematicFilter, setThematicFilter] = useState();

  const [showHiddenRow, setShowHiddenRow] = useState(false);

  const [allSelected, setAllSelected] = useState(true);

  const handleFilter = (filter) => {
    setFilters(filter);

    // filters.includes(filter)
    //   ? setFilters(filters.filter((value) => value !== filter))
    //   : setFilters(filters.concat(filter));
  };

  const handleUmbrellaCategories = (e) => {

    let filter = e.target.id
    
     umbrellaCategories.includes(filter)
      ? setUmbrellaCategories(umbrellaCategories.filter((value) => value !== filter))
      : setUmbrellaCategories(umbrellaCategories.concat(filter));
  }

  const handleThematicFilter = (event) => {
    setThematicFilter(event.target.value);
    if (thematicFilter == "high-protein") {
      setShowHiddenRow(true);
      requestSort("proteinPerCalorie");
    }
    if (thematicFilter == "low-carb"){
      requestSort("proteinPerCalorie");
    }
    
  };

  const handleAllergens = (event) => {
    let allergen = event.target.id;
    allergens.includes(allergen)
      ? setAllergens(allergens.filter((value) => value !== allergen))
      : setAllergens(allergens.concat(allergen));
  };

  let {
    items,
    requestSort,
    requestSortPreserveDirection,
    sortConfig,
    SortableTableHeader,
    SortableTableHeaderInverse,
    SortableTableHeaderROI,
  } = useSortableData(mealData);

  const handleSetMaxCalories = (event) => {
    setMinCalories(0);
    setMaxCalories(event.target.value);
  };

  const handleSetMinCalories = (event) => {
    setMinCalories(event.target.value);
    setMaxCalories(5000);
  };

  useEffect(() => {}, [minCalories, maxCalories]);

  const filteredItems = items
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
      return umbrellaCategories.includes(getUmbrellaCategory(item.category.parentCategory.name))
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

  const marks = [
    {
      value: 0,
      label: "",
    },
    {
      value: 100,
      label: "",
    },
    {
      value: 200,
      label: "200",
    },
    {
      value: 300,
    },
    {
      value: 400,
      label: "400",
    },
    {
      value: 500,
    },
    {
      value: 600,
      label: "600",
    },
    {
      value: 700,
    },
    {
      value: 800,
      label: "800",
    },
    {
      value: 900,
    },
    {
      value: 1000,
      label: "",
    },
  ];

  return (
    <div className="">
      <NextSeo
        title={`${restaurant.name} Nutrition Facts and Calories | HealthyFastFood`}
        description={`Discover nutrition facts, macros, and the healthiest items at ${restaurant.name}`}
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
            " Menu Nutrition Facts and Calories | Healthy Fast Food",
          description:
            "Discover nutrition facts, macros, and the healthiest items at " +
            restaurant.name,
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
        <title>{restaurant.name} Nutrition | Healthy Fast Food</title>
        <meta name="description" content="" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Layout>
        <div className="grid grid-cols-6 gap-6">
          <aside className="shrink-0 pb-10 col-span-1">
            <div className="mt-8 ">
              <h3 className="text-stone-900 text-sm font-bold pb-2">
                Calorie Limits
              </h3>

              <div className=" text-stone-600 text-sm space-y-1">
                <button
                  className="block hover:text-orange-500"
                  value={100}
                  onClick={handleSetMaxCalories}
                >
                  Up to 100 cal{" "}
                </button>
                <button
                  className="block  hover:text-orange-500"
                  value={300}
                  onClick={handleSetMaxCalories}
                >
                  Up to 300 cal
                </button>
                <button
                  className="block  hover:text-orange-500"
                  value={500}
                  onClick={handleSetMaxCalories}
                >
                  Up to 500 cal
                </button>
                <button
                  className="block  hover:text-orange-500"
                  value={800}
                  onClick={handleSetMaxCalories}
                >
                  Up to 800 cal
                </button>
                <button
                  className="block  hover:text-orange-500"
                  value={800}
                  onClick={handleSetMinCalories}
                >
                  800 cal & above
                </button>
              </div>

              {/* <Slider 
                    defaultValue={600} 
                    aria-label="Default"  
                    marks={marks} 
                    step={10}
                    valueLabelDisplay="auto" 
                    min={0}
                    max={1000}
                   /> */}
            </div>

            <section className="mt-6">
              <h3 className="text-stone-900 text-sm font-bold pb-2">
                Type
              </h3>
              <div className="flex items-center mb-1 " >  
              <input
                  className="w-4 h-4 text-orange-600 bg-gray-100 rounded border-gray-300 cursor-pointer"
                  id="food"
                  value="food"
                  name="umbrellaCategories"
                  type="checkbox"
                  checked={umbrellaCategories.includes("food")}
                  onChange={(e) => handleUmbrellaCategories(e)}
                />
                <label
                  htmlFor="food"
                  className="special-input cursor-pointer inline-flex whitespace-nowrap items-center pl-2 text-sm"
                >
                  Food
               </label>
               </div>
               <div className="flex items-center mb-1" >
               <input
                  className="w-4 h-4 text-orange-600 bg-gray-100 rounded border-gray-300 cursor-pointer"
                  id="beverage"
                  value="beverage"
                  name="umbrellaCategories"
                  type="checkbox"
                  checked={umbrellaCategories.includes("beverage")}
                  onChange={(e) => handleUmbrellaCategories(e)}
                />
                 <label
                    htmlFor="beverage"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center pl-2 text-sm"
                  >
                    Beverage
               </label>
               </div>
               <div className="flex items-center mb-1 " >
               <input
                  className="w-4 h-4 text-orange-600 bg-gray-100 rounded border-gray-300 cursor-pointer"
                  id="condiment"
                  name="umbrellaCategories"
                  type="checkbox"
                  checked={umbrellaCategories.includes("condiment")}
                  onChange={(e) => handleUmbrellaCategories(e)}
                />
                 <label
                    htmlFor="condiment"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center pl-2 text-sm"
                  >
                    Condiments & Dressings
               </label>
               </div>

              {/* 

<div className="inline-block mb-2" key="all">
        <input
          id="all"
          type="checkbox"
          checked={filters.length == 0}
          onChange={() => setFilters([])}
        />
        <label
          htmlFor="all"
          className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium"
        >
          All
        </label>
      </div>

      {categories.map((category) => {
        return (
          <div className="inline-block  mb-2" key={category}>
            <input
              id={category}
              type="checkbox"
              checked={filters.includes(category)}
              onChange={() => handleFilter(category)}
            />
            <label
              htmlFor={category}
              className="cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium "
            >
              {formatParentCategory(category, false, true, true)}
            </label>
          </div>
        );
      })} */}
            </section>

            <section className="mt-6">
              <h3 className="text-stone-900 text-sm font-bold">
                Allergens
              </h3>

              <div className="pt-2 ">
                <div className="inline-block mb-1 mr-1" key="">
                  <input
                    id="gluten"
                    name="allergens"
                    className="button-checkbox"
                    type="checkbox"
                    checked={allergens.includes("gluten")}
                    onChange={(e) => handleAllergens(e)}
                  />
                  <label
                    htmlFor="gluten"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm font-medium hover:bg-stone-200"
                  >
                    Gluten Free
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1" key="">
                  <input
                    className="button-checkbox"
                    id="milk"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("milk")}
                    onChange={(e) => handleAllergens(e)}
                  />
                  <label
                    htmlFor="milk"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm hover:bg-stone-200"
                  >
                    Dairy Free
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1">
                  <input
                   className="button-checkbox"
                    id="peanuts"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("peanuts")}
                    onChange={(e) => handleAllergens(e)}
                  />
                  <label
                    htmlFor="peanuts"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm font-medium hover:bg-stone-200"
                  >
                    No Peanuts
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1">
                  <input
                   className="button-checkbox"
                    id="eggs"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("eggs")}
                    onChange={(e) => handleAllergens(e)}
                  />
                  <label
                    htmlFor="eggs"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm font-medium hover:bg-stone-200"
                  >
                    No Eggs
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1">
                  <input
                   className="button-checkbox"
                    id="wheat"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("wheat")}
                    onChange={(e) => handleAllergens(e)}
                  />
                  <label
                    htmlFor="wheat"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm font-medium hover:bg-stone-200"
                  >
                    No Wheat
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1">
                  <input
                   className="button-checkbox"
                    id="soy"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("soy")}
                    onChange={handleAllergens}
                  />
                  <label
                    htmlFor="soy"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm font-medium hover:bg-stone-200"
                  >
                    No Soy
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1">
                  <input
                   className="button-checkbox"
                    id="tree nuts"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("tree nuts")}
                    onChange={handleAllergens}
                  />
                  <label
                    htmlFor="tree nuts"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm font-medium hover:bg-stone-200"
                  >
                    No Tree Nuts
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1">
                  <input
                   className="button-checkbox"
                    id="fish"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("fish")}
                    onChange={handleAllergens}
                  />
                  <label
                    htmlFor="fish"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm font-medium hover:bg-stone-200"
                  >
                    No Fish
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1">
                  <input
                   className="button-checkbox"
                    id="shellfish"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("shellfish")}
                    onChange={handleAllergens}
                  />
                  <label
                    htmlFor="shellfish"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm font-medium hover:bg-stone-200"
                  >
                    No Shellfish
                  </label>
                </div>
              </div>
            </section>

            <section className="mt-6 bg-stone-50 rounded-xl p-2">
              <h3 className="text-stone-600 text-xs uppercase font-semibold p-2 ">
                Also Check Out
              </h3>
              {restaurants.map((restaurant) => (
                <div
                  className="hover:bg-stone-200 rounded-xl"
                  key={restaurant.slug}
                >
                  <a
                    href={`/${restaurant.slug}`}
                    className="cursor-pointer w-full flex items-center p-2"
                    key={restaurant.slug}
                  >
                    {/* <li key={restaurant.slug} className="list-decimal flex items-center py-1 px-3 rounded-lg hover:bg-stone-100 hover:text-red-500"> */}
                    <div className="relative w-6 h-6">
                      <Image
                        className=" flex-shrink-0 rounded-md"
                        src={`/images/logosSmall/${restaurant.slug}.webp`}
                        alt={`${restaurant.name} Logo`}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                    <div className="pl-2 text-stone-500 text-sm">
                      {restaurant.name}
                    </div>
                  </a>
                </div>
              ))}
            </section>
          </aside>
          <main className="mt-8 col-span-5">
            <div className="flex items-center">
              <div className="relative w-14 h-14 mr-4">
                <Image
                  className=" flex-shrink-0 rounded-md mr-2 z-0"
                  src={`/images/logosSmall/${restaurant.slug}.webp`}
                  alt={`${restaurant.name} Logo`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div>
                <Breadcrumbs pages={pages} />
                <h1 className="text-3xl font-bold mt-1">
                  {restaurant.name} Menu{" "}
                  <span className="text-stone-500 font-normal">
                    Nutrition Facts & Calories
                  </span>
                </h1>
              </div>
            </div>

            <div className="mt-4">
              <Tabs activeTab="all" />
            </div>

            {/* <p className="text-stone-500 mt-2 mb-2">
                Nutrition information for all menu tems from {restaurant.name}.
                Discover which meals are healthiest. Click on meal items for
                more details.
              </p> */}

            <section className="flex py-4 space-x-2">
              <button
                value="high-protein"
                key=""
                onClick={handleThematicFilter}
                className={classNames(
                  thematicFilter == "high-protein"
                    ? "text-orange-600 bg-stone-100 shadow-inner font-medium"
                    : " text-stone-700 hover:text-stone-900 hover:bg-stone-100  shadow-sm",
                  "whitespace-nowrap py-2 px-4 rounded-lg  text-md flex items-center border"
                )}
              >
                <img
                  className="h-6 w-6 mr-2"
                  src={`/images/icons/muscle.webp`}
                />
                High Protein
              </button>
              <button
                value="low-carb"
                key=""
                onClick={handleThematicFilter}
                className={classNames(
                  thematicFilter == "low-carb"
                    ? "text-red-600 bg-stone-100 shadow-inner font-medium"
                    : " text-stone-700 hover:text-stone-900 hover:bg-stone-100  shadow-sm",
                  "whitespace-nowrap py-2 px-4 rounded-lg  text-md flex items-center border"
                )}
              >
                <img className="h-6 w-6 mr-2" src={`/images/icons/leaf.webp`} />
                Low Carb
              </button>
              <button
                value="low-sodium"
                key=""
                onClick={handleThematicFilter}
                className={classNames(
                  thematicFilter == "low-sodium"
                  ? "text-red-600 bg-stone-100 shadow-inner font-medium"
                    : " text-stone-700 hover:text-stone-900 hover:bg-stone-100  shadow-sm",
                  "whitespace-nowrap py-2 px-4 rounded-lg  text-md flex items-center border"
                )}
              >
                <img
                  className="h-6 w-6 mr-2"
                  src={`/images/icons/sodium.webp`}
                />
                Low Sodium
              </button>
              <button
               value="low-cholesterol"
                key=""
                onClick={handleThematicFilter}
                className={classNames(
                  thematicFilter == "low-cholesterol"
                  ? "text-red-600 bg-stone-100 shadow-inner font-medium "
                    : " text-stone-700 hover:text-stone-900 hover:bg-stone-100  shadow-sm",
                  "whitespace-nowrap py-2 px-4 rounded-lg text-md flex items-center border "
                )}
              >
                <img className="h-6 w-6 mr-2" src={`/images/icons/heart.webp`} />
                {/* <div className="text-xl">❤️</div> */}
                Low Cholesterol
              </button>
              <a
                value="keto"
                key=""
                onClick={handleThematicFilter}
                className={classNames(
                  thematicFilter == "keto"
                  ? "text-red-600 bg-stone-100 shadow-inner font-medium "
                    : " text-stone-700 hover:text-stone-900 hover:bg-stone-100  shadow-sm",
                  "whitespace-nowrap py-2 px-4 rounded-lg text-md flex items-center border shadow-sm"
                )}
              >
                <img className="h-6 w-6 mr-2" src={`/images/icons/avocado.webp`} />
                {/* <div className="text-xl">❤️</div> */}
                Keto
              </a>
            </section>

            <article className="">
              {/* <section className="mt-4 mb-0 space-x-1">
                  <div className="inline-block mb-2" key="all">
                    <input
                      id="all"
                      type="checkbox"
                      checked={filters.length == 0}
                      onChange={() => setFilters([])}
                    />
                    <label
                      htmlFor="all"
                      className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      All
                    </label>
                  </div>

                  {categories.map((category) => {
                    return (
                      <div className="inline-block  mb-2" key={category}>
                        <input
                          id={category}
                          type="checkbox"
                          checked={filters.includes(category)}
                          onChange={() => handleFilter(category)}
                        />
                        <label
                          htmlFor={category}
                          className="cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium "
                        >
                          {formatParentCategory(category, false, true, true)}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </section> */}
              {/* <section className="mt-4 mb-0 space-x-1">
                  <div className="inline-block text-sm font-medium text-stone-400 pr-2 border-r mr-2">Allergies</div>
                  <div className="inline-block mb-2" key="">
                    <input
                      id="gluten"
                      name="allergens"
                      type="checkbox"
                      checked={allergens.includes("gluten")}
                      onChange={e=>handleAllergens(e)}
                    />
                    <label
                      htmlFor="gluten"
                      className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      Gluten Free
                    </label>
                  </div>
                  <div className="inline-block mb-2" key="">
                    <input
                      id="milk"
                      name="allergens"
                      type="checkbox"
                      checked={allergens.includes("milk")}
                      onChange={e=>handleAllergens(e)}
                    />
                    <label
                      htmlFor="milk"
                      className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      Dairy Free
                    </label>
                  </div>
                  <div className="inline-block mb-2" >
                    <input
                      id="peanuts"
                      name="allergens"
                      type="checkbox"
                      checked={allergens.includes("peanuts")}
                      onChange={e=>handleAllergens(e)}
                    />
                    <label
                      htmlFor="peanuts"
                      className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      No Peanuts
                    </label>
                  </div>
                  <div className="inline-block mb-2" >
                    <input
                      id="eggs"
                      name="allergens"
                      type="checkbox"
                      checked={allergens.includes("eggs")}
                      onChange={e=>handleAllergens(e)}
                    />
                    <label
                      htmlFor="eggs"
                      className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      No Eggs
                    </label>
                  </div>
                  <div className="inline-block mb-2" >
                    <input
                      id="wheat"
                      name="allergens"
                      type="checkbox"
                      checked={allergens.includes("wheat")}
                      onChange={e=>handleAllergens(e)}
                    />
                    <label
                      htmlFor="wheat"
                      className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      No Wheat
                    </label>
                  </div>
                  <div className="inline-block mb-2" >
                    <input
                      id="soy"
                      name="allergens"
                      type="checkbox"
                      checked={allergens.includes("soy")}
                      onChange={handleAllergens}
                    />
                    <label
                      htmlFor="soy"
                      className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      No Soy
                    </label>
                  </div>
                  <div className="inline-block mb-2" >
                    <input
                      id="tree nuts"
                      name="allergens"
                      type="checkbox"
                      checked={allergens.includes("tree nuts")}
                      onChange={handleAllergens}
                    />
                    <label
                      htmlFor="tree nuts"
                      className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      No Tree Nuts
                    </label>
                  </div>
                  <div className="inline-block mb-2" >
                    <input
                      id="fish"
                      name="allergens"
                      type="checkbox"
                      checked={allergens.includes("fish")}
                      onChange={handleAllergens}
                    />
                    <label
                      htmlFor="fish"
                      className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      No Fish
                    </label>
                  </div>
                  <div className="inline-block mb-2" >
                    <input
                      id="shellfish"
                      name="allergens"
                      type="checkbox"
                      checked={allergens.includes("shellfish")}
                      onChange={handleAllergens}
                    />
                    <label
                      htmlFor="shellfish"
                      className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      No Shellfish
                    </label>
               </section> */}

              {/* <section className="flex items-center">
                <div className="inline-block text-sm font-medium text-stone-400 pr-2 border-r mr-2 whitespace-nowrap">
                Max Calories
                </div>
                <>
                  
                </>
               </section> */}

              <table className="w-full divide-y divide-stone-300 rounded-lg min-w-full">
                <thead className="rounded-t-lg">
                  <tr>
                    {/* <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-stone-900"
                    >
                      
                    </th> */}
                    <th
                      scope="col"
                      className="py-3.5 text-sm font-semibold text-greeny-600 text-left"
                    >
                      <div className="flex items-center">
                        {/* <div className="ml-8">
                            <SortableTableHeader
                              colKey="restaurant"
                              name="Restaurant"
                            />
                          </div> */}
                        <div className="ml-2">
                          <SortableTableHeader colKey="meal_name" name="Name" />
                        </div>
                      </div>
                    </th>
                    {/* <th
                      scope="col"
                      className="py-3.5 text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeader colKey="category" name="Type" />
                    </th> */}

                    {showHiddenRow && (
                      <th
                        scope="col"
                        className="px-1 py-3.5 text-left text-sm font-semibold text-stone-900 bg-green-100"
                      >
                        <SortableTableHeaderInverse
                          colKey="proteinPerCalorie"
                          name="Protein per Calorie"
                        />
                      </th>
                    )}

                    <th
                      scope="col"
                      className=" py-3.5 text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeader colKey="calories" name="Calories" />
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-right text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeader colKey="protein" name="Protein" />
                    </th>
                    <th
                      scope="col"
                      className=" py-3.5 text-left text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeader
                        colKey="total_carbohydrates"
                        name="Carbs"
                      />
                    </th>
                    <th
                      scope="col"
                      className=" py-3.5 text-left text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeader colKey="total_fat" name="Fat" />
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-left text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeaderInverse
                        colKey="cholesterol"
                        name="Cholesterol"
                      />
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-left text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeaderInverse
                        colKey="sodium"
                        name="Sodium"
                      />
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-left text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeaderInverse colKey="sugar" name="Sugar" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white w-full">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((meal) => (
                      <MealRow
                        restaurantName={restaurant.name}
                        restaurantSlug={restaurant.slug}
                        showRestaurantData={false}
                        meal={meal}
                        key={meal.mealName}
                        showHiddenRow={showHiddenRow}
                      />
                    ))
                  ) : (
                    <tr className="">
                      <td
                        colSpan={8}
                        className="single-cell-row text-lg text-stone-500 text-center p-10"
                      >
                        Sorry! It looks like we don&apos;t have this data yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </article>
          </main>
        </div>
      </Layout>
    </div>
  );
}
