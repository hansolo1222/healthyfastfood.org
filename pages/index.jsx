import Head from "next/head";
import Image from "next/image";
//import styles from '../styles/Home.module.css'
import Header from "../components/Header";
import Layout from "../components/Layout";
import { useState } from "react";
import { useSortableData } from "../components/UseSortableData";
import { useFilteredData } from "../components/UseFilteredData";
const mcdonalds = require("/public/data/mcdonalds.json");
import prisma from "../lib/prisma";
import RestaurantCloud from "../components/RestaurantCloud";
import { useRouter } from "next/router";

export const getServerSideProps = async (context) => {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: [
      {
        rank: "asc",
      },
    ],
  });



  const highestProtein = await prisma.meal.findMany({
    take: 15,
    where: {
      protein: {
          gt: 50
      },
      restaurant: {
        rank: {
         gt: 50
        }
    },
    },
    orderBy: [
      {
        protein: "desc",
      },
    ],
    include: {
      restaurant: true,
      category: true,
      variants: true
    },
  });

  // if (!data) {
  //   return {
  //     notFound: true,
  //   };
  // }

  return {
    props: {
      // data: JSON.parse(JSON.stringify(data)),
      restaurants: JSON.parse(JSON.stringify(restaurants)),
      highestProtein: JSON.parse(JSON.stringify(highestProtein)),
    },
  };
};

export default function Home(props) {
  let { data, restaurants, highestProtein } = props;
  let meals = highestProtein;
  let topRestaurants = restaurants.slice(0,15)

  console.log(topRestaurants)

  let mealData = meals.map((meal) => {
    if (meal.variants.length > 0) {
      let fullName = `${meal.name} (${meal.variants[0].variantName})`
      return {...meal, ...meal.variants[0], name: fullName}
    } else return meal;
  });

  console.log(mealData)

  const [selectedMeals, setSelectedMeals] = useState(null);

  const [filters, setFilters] = useState([
    "Breakfast",
    "Burgers & Sandwiches",
    "Salads",
  ]);

  const handleFilter = (filter) => {
    console.log(filter);
    filters.includes(filter)
      ? setFilters(filters.filter((value) => value !== filter))
      : setFilters(filters.concat(filter));
    console.log(filters);
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

  const filtereditems = items.filter(
    (item) =>
      (filters.includes("Beverages") && item.category === "Beverages") ||
      (filters.includes("Burgers & Sandwiches") &&
        item.category === "Burgers & Sandwiches") ||
      (filters.includes("Breakfast") && item.category === "Breakfast") ||
      (filters.includes("Salads") && item.category === "Salads") ||
      (filters.includes("Salads") && item.category === "Condiments")
  );

  // filter applied after sort
  // let {
  //   filteritems,
  //   requestFilter,
  //   requestFilterPreserveFilter,
  //   filterConfig,
  // } = useFilteredData(items, selectedMeals);

  return (
    <div className="">
      <Head>
        <title>Healthy Fast Food</title>
        <meta
          name="description"
          content="Discover the healthiest fast food options"
        />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Layout>
        <RestaurantCloud restaurants={topRestaurants}/>

        <h2 className="text-3xl font-bold text-center mb-8 mt-8">
          Highest Protein Meals
        </h2>

        {/* <div className="flex space-x-2 mt-4 mb-4">
          <div>
          <input
                id="burgers"
                type="checkbox"
                checked={filters.includes("Burgers & Sandwiches")}
                onChange={() => handleFilter("Burgers & Sandwiches")}
              />
            <label
              htmlFor="burgers"
              className="cursor-pointer inline-flex items-center px-3.5 py-0.5 rounded-full text-sm font-medium"
            >
              Burgers & Sandwiches
             
            </label>
          </div>
          <div>
            <input
              id="breakfast"
              type="checkbox"
              checked={filters.includes("Breakfast")}
              onChange={() => handleFilter("Breakfast")}
            />
            <label
              htmlFor="breakfast"
              className="cursor-pointer inline-flex items-center px-3.5 py-0.5 rounded-full text-sm font-medium "
            >
              Breakfast
            </label>
          </div>
          <div>
            <input
              id="salads"
              type="checkbox"
              checked={filters.includes("Salads")}
              onChange={() => handleFilter("Salads")}
            />
            <label
              htmlFor="salads"
              className="cursor-pointer inline-flex items-center px-3.5 py-0.5 rounded-full text-sm font-medium "
            >
              Salads
            </label>
          </div>
          <div>
            <input
              id="beverages"
              type="checkbox"
              checked={filters.includes("Beverages")}
              onChange={() => handleFilter("Beverages")}
            />
            <label
              htmlFor="beverages"
              className="cursor-pointer inline-flex items-center px-3.5 py-0.5 rounded-full text-sm font-medium "
            >
              Beverages
            </label>
          </div>
          <div>
            <input
              id="condiments"
              type="checkbox"
              checked={filters.includes("Condiments")}
              onChange={() => handleFilter("Condiments")}
            />
            <label
              htmlFor="condiments"
              className="cursor-pointer inline-flex items-center px-3.5 py-0.5 rounded-full text-sm font-medium "
            >
              Condiments
            </label>
          </div>
        </div> */}
        <table className="min-w-full divide-y divide-stone-300 rounded-lg">
          <thead className="rounded-t-lg">
            <tr>
              {/* <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-stone-900"
                    >
                      
                    </th> */}
              <th
                scope="col"
                className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-left"
              >
                <div className="flex items-center">
                  <div className="ml-8">
                    <SortableTableHeader
                      colKey="restaurantSlug"
                      name="Restaurant"
                    />
                  </div>
                  <div className="ml-2">
                    <SortableTableHeader colKey="name" name="Name" />
                  </div>
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-0.5 text-sm font-semibold text-stone-900"
              >
                <SortableTableHeader colKey="categoryName" name="Type" />
              </th>
              <th
                scope="col"
                className="px-3 py-0.5 text-sm font-semibold text-stone-900"
              >
                <SortableTableHeader colKey="calories" name="Calories" />
              </th>
              <th
                scope="col"
                className=" py-0.5 text-right text-sm font-semibold text-stone-900"
              >
                <SortableTableHeader colKey="protein" name="Protein" />
              </th>
              <th
                scope="col"
                className=" py-0.5 text-left text-sm font-semibold text-stone-900"
              >
                <SortableTableHeader
                  colKey="totalCarbohydrates"
                  name="Total Carbs"
                />
              </th>
              <th
                scope="col"
                className="py-0.5 text-left text-sm font-semibold text-stone-900"
              >
                <SortableTableHeader colKey="totalFat" name="Total Fat" />
              </th>
              <th
                scope="col"
                className=" py-0.5 text-left text-sm font-semibold text-stone-900"
              >
                <SortableTableHeaderInverse
                  colKey="cholesterol"
                  name="Cholesterol"
                />
              </th>
              <th
                scope="col"
                className=" py-0.5 text-left text-sm font-semibold text-stone-900"
              >
                <SortableTableHeaderInverse colKey="sodium" name="Sodium" />
              </th>
              <th
                scope="col"
                className=" py-0.5 text-left text-sm font-semibold text-stone-900"
              >
                <SortableTableHeaderInverse colKey="sugar" name="Sugar" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-white">
            {items.map((meal) => (
              <MealRow meal={meal} key={meal.restaurant.name+meal.name} restaurantName={meal.restaurant.name} restaurantSlug={meal.restaurant.slug} showRestaurantData={true}/>
            ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
}

export const formatCategory = (category, asElement, emojiOnly) => {
  let text;
  let color;
  if (["Burgers & Sandwiches", "Burgers"].includes(category)) {
    text = "🍔 Sandwiches";
    color = "red";
  } else if (["Breakfast"].includes(category)) {
    text = "🍳 Breakfast";
    color = "yellow";
  } else if (["Beverages"].includes(category)) {
    text = "🥤 Beverages";
    color = "blue";
  } else if (["Desserts"].includes(category)) {
    text = "🍦 Desserts";
    color = "pink";
  } else if (["Salads"].includes(category)) {
    text = "🥗 Salads";
    color = "green";
  } else if (["Condiments", "Sauces & Toppings", "Sauces"].includes(category)) {
    text = "🧂 Toppings";
    color = "stone";
  } else if (["McCafe Coffee", "Coffee"].includes(category)) {
    text = "☕ Coffee";
    color = "indigo";
  } else if (["Sides", "Snacks & Sides"].includes(category)) {
    text = "🍟 Sides";
    color = "orange";
  } else if (["Chicken Nuggets", "Chicken Nuggets & Strips"].includes(category)) {
    text = "🐔 Chicken Nuggets";
    color = "orange";
  } else if (["Chicken & Fish", "Classic Chicken"].includes(category)) {
    text = "🐔 Chicken";
    color = "rose";
  } else if (["Hacks", "Menu Hacks"].includes(category)) {
    text = "🎁 Hacks";
    color = "purple";
  } else if (["Cool Wraps"].includes(category)) {
    text = "🌯 Wraps";
    color = "purple";
  }
    else if (["Happy Meals", "Kid's Meal"].includes(category)) {
      text = "🧒 Kids Meals";
      color = "purple";
    
  } else {
    text = category;
    color = "teal";
  }
  if (asElement) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-stone-800`}
      >
        {text}
      </span>
    );
  } else {
    if (emojiOnly) {
      return text.substring(0, 2);
    } else {
      return text;
    }
  }
};

export const MealRow = ({
  restaurantName,
  restaurantSlug,
  showRestaurantData,
  meal,
}) => {
  return (
    <tr className="mealRow cursor-pointer hover:bg-stone-50">
      <td className=" py-1.5 text-md text-stone-900">
        <div className="flex items-center">
          <a href={`/${restaurantSlug}`} className="flex items-center">
            {showRestaurantData ? (
              <div className="relative w-6 h-6">
                <Image
                  className=" flex-shrink-0 rounded-md mr-2"
                  src={`/images/logosSmall/${restaurantSlug}.webp`}
                  alt={`${restaurantName} Logo`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            ) : (
              <div className="text-2xl">{formatCategory(meal.category.name, false, true)}</div>
            )}
          </a>

          <a
            href={`/${restaurantSlug}/${meal.slug}`}
            className="hover:text-red-500 ml-3"
          >
            {showRestaurantData && (
              <div className="text-xs text-stone-500">{restaurantName}</div>
            )}
            <span className="">{meal.name}</span>
          </a>
        </div>
      </td>
      <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
        {formatCategory(meal.category.name, true, false)}
      </td>
      <td className=" py-1 text-md text-stone-900 text-center">
        {meal.calories} <span className="text-stone-500 text-sm">cal</span>
      </td>
      <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
        {meal.protein} <span className="text-stone-500 text-sm">g</span>
      </td>
      <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
        {meal.totalCarbohydrates}{" "}
        <span className="text-stone-500 text-sm">g</span>
      </td>
      <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
        {meal.totalFat} <span className="text-stone-500 text-sm">g</span>
      </td>
      <td className="whitespace-nowrap  py-1 text-md text-stone-900 text-center">
        {meal.cholesterol} <span className="text-stone-500 text-sm">mg</span>
      </td>
      <td className="whitespace-nowrap  py-1 text-md text-stone-900 text-center">
        {meal.sodium} <span className="text-stone-500 text-sm">mg</span>
      </td>
      <td className="whitespace-nowrap  py-1 text-md text-stone-900 text-center">
        {meal.sugar} <span className="text-stone-500 text-sm">g</span>
      </td>
    </tr>
  );
};
