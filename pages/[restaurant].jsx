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
import { classNames, getCustomNutritionRowInfo } from "../components/utils";
import {AsideFilterByCalories} from "../components/AsideFilterByCalories"

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
          variants: {
            include: {
              subvariants: true
            }
          }
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
      if (meal.variants[0].subvariants.length > 0) {
        let fullName = `${meal.name} (${meal.variants[0].variantName}) (${meal.variants[0].subvariants[0].subvariantName})`;
        return {
          ...meal,
          ...meal.variants[0].subvariants[0],
          name: fullName,
        }
      } 
      else {
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

  meals = meals.map((meal)=>{
    return {...meal, categoryName: meal.category.name}
  })

  let categories = [...new Set(meals.map((item) => item.category.name))];

  const [mealData, setMealData] = useState(meals);

  const [filters, setFilters] = useState([]);
  const [umbrellaCategories, setUmbrellaCategories] = useState(["food","beverage"])
  const [allergens, setAllergens] = useState([]);

  const [minCalories, setMinCalories] = useState(0);
  const [maxCalories, setMaxCalories] = useState(2000);

  const [thematicFilter, setThematicFilter] = useState();
  const [showCustomRow, setShowCustomRow] = useState(false);




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
    let inputted = event.target.value
    if (thematicFilter == inputted){
      setThematicFilter(null)
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

    setMealData(filteredItems(meals.map((m) => {
          return ({
            ...m,
            [thematicFilter]: calculateCustomNutrition(thematicFilter, m),
          })
        }))
    )
    console.log(mealData)
    requestSort(thematicFilter, getCustomNutritionRowInfo(thematicFilter).direction)

  }, [thematicFilter,showCustomRow, umbrellaCategories, maxCalories, minCalories, allergens]);

  const calculateCustomNutrition = (thematicFilter, m) => {
    if (thematicFilter == "highProtein"){
    return m.calories == 0 ? 0 : (m.protein / m.calories).toFixed(3)
    } else if (thematicFilter == "lowCarb"){
      return m.calories == 0 ? 0 : (m.totalCarbohydrates / m.calories).toFixed(3)
    } else if (thematicFilter == "lowSodium"){
      return m.calories == 0 ? 0 : (m.sodium / m.calories).toFixed(3)
    } else if (thematicFilter == "lowCholesterol"){
      return m.calories == 0 ? 0 : (m.cholesterol / m.calories).toFixed(3)
    } 
    // else if (thematicFilter == "lowCarb"){
    //   return m.calories == 0 ? 0 : (m.totalCarbohydrates / m.calories).toFixed(3)
    // }
  }



  const filteredItems = (items) => items
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


    let {
      items,
      requestSort,
      requestSortPreserveDirection,
      sortConfig,
      SortableTableHeader,
      SortableTableHeaderInverse,
      SortableTableHeaderROI,
    } = useSortableData(mealData);

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
        <div className="flex">
          <aside className="hidden lg:block shrink-0 pb-10 w-56 pr-4">
            <AsideFilterByCalories handleSetMaxCalories={handleSetMaxCalories}
            handleSetMinCalories={handleSetMinCalories}/>

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
                <div className="inline-block mb-1 mr-1" key="gluten">
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
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm hover:bg-stone-200 hover:text-stone-700"
                  >
                    Gluten Free
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1" key="milk">
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
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm hover:bg-stone-200 hover:text-stone-700"
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
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm hover:bg-stone-200 hover:text-stone-700"
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
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm hover:bg-stone-200 hover:text-stone-700"
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
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm  hover:bg-stone-200 hover:text-stone-700"
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
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm  hover:bg-stone-200 hover:text-stone-700"
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
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm  hover:bg-stone-200 hover:text-stone-700"
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
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm  hover:bg-stone-200 hover:text-stone-700"
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
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm  hover:bg-stone-200 hover:text-stone-700"
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


          <main className="mt-4 md:mt-8 w-full">
            <div className="block md:hidden mb-2">
              <Breadcrumbs pages={pages} className=""/>
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
                <Breadcrumbs pages={pages} className=""/>
                </div>
                <h1 className="text-lg md:text-xl lg:text-3xl font-bold mt-1">
                  {restaurant.name} {" "}
                  <span className="text-stone-500 font-normal">
                  Menu Nutrition Facts & Calories
                  </span>
                </h1>
              </div>
            </div>

            <div className="mt-4">
              <Tabs activeTab="all" />
            </div>

            <section className="flex py-4 space-x-2 w-full overflow-x-auto">
              <button
                value="highProtein"
                key="highProtein"
                onClick={handleThematicFilter}
                className={classNames(
                  thematicFilter == "highProtein"
                    ? "text-orange-600 bg-stone-100 shadow-inner font-medium"
                    : " text-stone-700 hover:text-stone-900 hover:bg-stone-100  shadow-sm",
                  "whitespace-nowrap py-2 px-4 rounded-lg  text-sm md:text-base  border flex items-center shrink-0"
                )}
              >
                  <img
                    className="h-6 w-6 mr-2"
                    src={`/images/icons/muscle.webp`}
                  />
                  High Protein
              </button>
              <button
                value="lowCarb"
                key="lowCarb"
                onClick={handleThematicFilter}
                className={classNames(
                  thematicFilter == "lowCarb"
                    ? "text-red-600 bg-stone-100 shadow-inner font-medium"
                    : " text-stone-700 hover:text-stone-900 hover:bg-stone-100  shadow-sm",
                  "whitespace-nowrap py-2 px-4 rounded-lg  text-sm md:text-base border flex items-center shrink-0"
                )}
              >
                <img className="h-6 w-6 mr-2" src={`/images/icons/leaf.webp`} />
                Low Carb
              </button>
              <button
                value="lowSodium"
                key="lowSodium"
                onClick={handleThematicFilter}
                className={classNames(
                  thematicFilter == "lowSodium"
                  ? "text-red-600 bg-stone-100 shadow-inner font-medium"
                    : " text-stone-700 hover:text-stone-900 hover:bg-stone-100  shadow-sm",
                  "whitespace-nowrap py-2 px-4 rounded-lg text-sm md:text-base border flex items-center shrink-0"
                )}
              >
                <img
                  className="h-6 w-6 mr-2"
                  src={`/images/icons/sodium.webp`}
                />
                Low Sodium
              </button>
              <button
               value="lowCholesterol"
                key="lowCholesterol"
                onClick={handleThematicFilter}
                className={classNames(
                  thematicFilter == "lowCholesterol"
                  ? "text-red-600 bg-stone-100 shadow-inner font-medium "
                    : " text-stone-700 hover:text-stone-900 hover:bg-stone-100  shadow-sm",
                  "whitespace-nowrap py-2 px-4 rounded-lg text-sm md:text-base border flex items-center shrink-0"
                )}
              >
                <img className="h-6 w-6 mr-2" src={`/images/icons/heart.webp`} />
                Low Cholesterol
              </button>
              {/* <a
                value="keto"
                key="keto"
                onClick={handleThematicFilter}
                className={classNames(
                  thematicFilter == "keto"
                  ? "text-red-600 bg-stone-100 shadow-inner font-medium "
                    : " text-stone-700 hover:text-stone-900 hover:bg-stone-100  shadow-sm",
                  "whitespace-nowrap py-2 px-4 rounded-lg text-base flex items-center border shadow-sm"
                )}
              >
                <img className="h-6 w-6 mr-2" src={`/images/icons/avocado.webp`} />
                Keto
              </a> */}
            </section>

            <article className="overflow-x-auto w-full">
              <section className="mt-4 mb-0 space-x-1">
                  <div className="inline-block mb-2 " key="all">
                    <input
                      id="all"
                      type="checkbox"
                      checked={filters.length == 0}
                      onChange={() => setFilters([])}
                      className="button-checkbox"
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
                      <div className="inline-block mb-2 button-checkbox" key={category}>
                        <input
                          id={category}
                          type="checkbox"
                          checked={filters.includes(category)}
                          onChange={() => handleFilter(category)}
                          className="button-checkbox"
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
              </section>
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

              <table className="w-full divide-y divide-stone-300 rounded-lg">
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
                        <div className="">
                          <SortableTableHeader colKey="name" name="Name"  direction="ascending"/>
                        </div>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeader colKey="categoryName" name="Type" direction="ascending"/>
                    </th>

                    {showCustomRow && (
                      <th
                        scope="col"
                        className="px-3 py-3.5 whitespace-nowrap text-left text-sm font-semibold text-stone-900 bg-green-100"
                      >
                        <SortableTableHeader
                          colKey="customNutritionRow"
                          name={getCustomNutritionRowInfo(thematicFilter).title}
                          direction={getCustomNutritionRowInfo(thematicFilter).direction}
                        />
                       
                      </th>
                    )}

                    <th
                      scope="col"
                      className=" py-3.5 text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeader 
                      colKey="calories" 
                      name="Calories" 
                      direction="ascending"/>
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-right text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeader 
                      colKey="protein" 
                      name="Protein" 
                      direction="descending"/>
                    </th>
                    <th
                      scope="col"
                      className=" py-3.5 text-left text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeader
                        colKey="totalCarbohydrates"
                        name="Carbs"
                        direction="ascending"
                      />
                    </th>
                    <th
                      scope="col"
                      className=" py-3.5 text-left text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeader 
                      colKey="totalFat" 
                      name="Fat" 
                      direction="ascending"/>
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-left text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeader
                        colKey="cholesterol"
                        name="Cholesterol"
                        direction="ascending"
                      />
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-left text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeader
                        colKey="sodium"
                        name="Sodium"
                        direction="ascending"
                      />
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-left text-sm font-semibold text-stone-900"
                    >
                      <SortableTableHeader 
                      colKey="sugar" 
                      name="Sugar" 
                      direction="ascending"/>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white w-full">
                  {items.length > 0 ? (
                    items.map((meal) => (
                      <MealRow
                        restaurantName={restaurant.name}
                        restaurantSlug={restaurant.slug}
                        showRestaurantData={false}
                        meal={meal}
                        key={meal.mealName}
                        showCustomRow={showCustomRow}
                        customRowKey={thematicFilter}
                        customRowUnits={getCustomNutritionRowInfo(thematicFilter).units}
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
