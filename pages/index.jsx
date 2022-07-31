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
    take: 10,
    where: {
      category: {
        parentCategorySlug: "burgers-sandwiches"
      },
      protein: {
          gt: 50
      },
      restaurant: {
        rank: {
         lt: 35
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
      category: {
        include: {
          parentCategory: true
        }
      },
      variants: true
    },
  });

  const highestProteinSalads = await prisma.meal.findMany({
    take: 10,
    where: {
      category: {
        parentCategorySlug: "salads"
      },
      calories: {
        lt: 600
      },
      protein: {
        gt: 1
      },
      restaurant: {
        rank: {
         lt: 35
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
      category: {
        include: {
          parentCategory: true
        }
      },
      variants: true
    },
  });
 

  return {
    props: {
      // data: JSON.parse(JSON.stringify(data)),
      restaurants: JSON.parse(JSON.stringify(restaurants)),
      highestProtein: JSON.parse(JSON.stringify(highestProtein)),
      highestProteinSalads: JSON.parse(JSON.stringify(highestProteinSalads)),
    },
  };
};

export default function Home(props) {
  let { data, restaurants, highestProtein, highestProteinSalads } = props;
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

        <h2 className="text-3xl font-bold text-center mb-8 mt-16">
          Highest Protein Burgers & Sandwiches
        </h2>


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


        <h2 className="text-3xl font-bold text-center mb-8 mt-16">
          Highest Protein Salads Less Than 600cal
        </h2>

        <table className="min-w-full divide-y divide-stone-300 rounded-lg shadow-lg border overflow-hidden">
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
            {highestProteinSalads.map((meal) => (
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


export const formatParentCategory = (category, includeElement, includeEmoji, includeText) => {
  let text = ""
  let color = ""
  let emoji = ""
console.log(category)
  if (category=="burgers-sandwiches") {
    emoji = "🍔";
    text = "Burgers & Sandwiches";
    color = "red";
  } 
  else if (category=="steaks") {
    emoji = "🥩"
    text = "Steak";
    color = "red";
  } 
  else if (category=="salads") {
    emoji = "🥗"
    text = "Salad";
    color = "green";
  } 
  else if (category=="burritos") {
    emoji = "🌯"
    text = "Burrito";
    color = "yellow";
  } 
  else if (category=="tacos") {
    emoji = "🌮"
    text = "Taco";
    color = "yellow";
  } 
  else if (category=="pizzas") {
    emoji = "🍕"
    text = "Pizza";
    color = "orange";
  } 
  else if (category=="soups") {
    emoji = "🍲"
    text = "Soup";
    color = "blue";
  } 
  else if (category=="bowls") {
    emoji = "🥣"
    text = "Bowl";
    color = "blue";
  } 
  else if (category=="pastas") {
    emoji = "🍝"
    text = "Pasta";
    color = "orange";
  } 
  else if (category=="pastries") {
    emoji = "🥐"
    text = "Pastry";
    color = "orange";
  } 
  else if (category=="breads") {
    emoji = "🍞"
    text = "Bread";
    color = "orange";
  } 
  else if (category=="dressings-sauces") {
    emoji = "🥫"
    text = "Dressings & Sauces";
    color = "stone";
  } 
  else if (category=="toppings") {
    emoji = "⬇️"
    text = "Toppings";
    color = "stone";
  } 
  else if (category=="sides") {
    emoji = "🍢"
    text = "Side";
    color = "blue";
  } 
  else if (category=="appetizers") {
    emoji = "🍽️"
    text = "Appetizer";
    color = "blue";
  } 
  else if (category=="breakfast") {
    emoji = "🍳"
    text = "Breakfast";
    color = "yellow";
  } 
  else if (category=="lunch-dinner") {
    emoji = "🥘"
    text = "Lunch & Dinner";
    color = "indigo";
  } 
  else if (category=="kids-meals") {
    emoji = "👶"
    text = "Kids Meal";
    color = "pink";
  } 
  else if (category=="senior-meals") {
    emoji = "🧓"
    text = "Senior Meal";
    color = "pink";
  } 

  else if (category=="beef") {
    emoji = "🐮"
    text = "Beef";
    color = "red";
  } 
  else if (category=="wings") {
    emoji = "🐓"
    text = "Wings";
    color = "yellow";
  } 
  else if (category=="chicken") {
    emoji = "🐔"
    text = "Chicken";
    color = "yellow";
  } 
  else if (category=="seafood") {
    emoji = "🐟"
    text = "Seafood";
    color = "stone";
  } 
  else if (category=="donuts") {
    emoji = "🍩"
    text = "Donuts";
    color = "stone";
  } 
  else if (category=="desserts") {
    emoji = "🧁"
    text = "Dessert";
    color = "stone";
  } 
  else if (category=="ice-cream") {
    emoji = "🍦"
    text = "Ice Cream";
    color = "stone";
  } 

  else if (category=="beverages") {
    emoji = "🥤"
    text = "Beverage";
    color = "stone";
  } 
  else if (category=="coffee") {
    emoji = "☕"
    text = "Coffee";
    color = "stone";
  } 
  else if (category=="shakes") {
    emoji = "🥤"
    text = "Shake";
    color = "stone";
  } 
  else if (category=="alcohol") {
    emoji = "🍺"
    text = "Alcohol";
    color = "stone";
  } 
  else {
    text = category;
    color = "teal";
  }

  let finalString = (includeEmoji ? emoji : "") + (includeEmoji && includeText ? " " : "") + (includeText ? text : "")

  if (includeElement) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-stone-800`}
      >
        {finalString}
      </span>
    );
  } else {
    return finalString
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
        {formatParentCategory(meal.category.parentCategoryName, true, false)}
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
        {parseFloat(meal.totalFat).toFixed(0)} <span className="text-stone-500 text-sm">g</span>
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
