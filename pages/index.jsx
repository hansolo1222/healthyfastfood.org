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
import {
  TableHeaders,
  TableMealRow,
  MiniTableMealRow,
} from "../components/TableMealRow";
import Link from "next/link";

export const getServerSideProps = async (context) => {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: [
      {
        rank: "asc",
      },
    ],
  });

  const highestProteinBurgers = await prisma.meal.findMany({
    take: 10,
    orderBy: [
      {
        protein: "desc",
      },
    ],
    where: {
      category: {
        parentCategorySlug: "burgers-sandwiches",
      },
      calories: {
        lt: 600,
      },
      protein: {
        gt: 1,
      },
      restaurant: {
        rank: {
          lt: 30,
        },
      },
    },
    include: {
      restaurant: true,
      category: {
        include: {
          parentCategory: true,
        },
      },
      variants: true,
    },
  });

  const highestProteinPizza = await prisma.meal.findMany({
    take: 10,
    where: {
      category: {
        parentCategorySlug: "pizzas",
      },
      calories: {
        lt: 600,
      },
      protein: {
        gt: 1,
      },
      restaurant: {
        rank: {
          lt: 50,
        },
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
          parentCategory: true,
        },
      },
      variants: true,
    },
  });

  const highestProteinBurritos = await prisma.meal.findMany({
    take: 10,
    where: {
      category: {
        parentCategorySlug: "burritos",
      },
      calories: {
        lt: 600,
      },
      protein: {
        gt: 1,
      },
      restaurant: {
        rank: {
          lt: 50,
        },
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
          parentCategory: true,
        },
      },
      variants: true,
    },
  });

  const highestProteinSalads = await prisma.meal.findMany({
    take: 10,
    where: {
      category: {
        parentCategorySlug: "salads",
      },
      calories: {
        lt: 500,
      },
      protein: {
        gt: 1,
      },
      restaurant: {
        rank: {
          lt: 30,
        },
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
          parentCategory: true,
        },
      },
      variants: true,
    },
  });

  const parentCategories = await prisma.parentCategory.findMany({
    take: 12,
  })

  return {
    props: {
      // data: JSON.parse(JSON.stringify(data)),
      restaurants: JSON.parse(JSON.stringify(restaurants)),
      parentCategories: JSON.parse(JSON.stringify(parentCategories)),
      highestProteinBurgers: JSON.parse(JSON.stringify(highestProteinBurgers)),
      highestProteinBurritos: JSON.parse(
        JSON.stringify(highestProteinBurritos)
      ),
      highestProteinSalads: JSON.parse(JSON.stringify(highestProteinSalads)),
      highestProteinPizza: JSON.parse(JSON.stringify(highestProteinPizza)),
    },
  };
};

export default function Home(props) {
  let {
    data,
    restaurants,
    highestProteinBurgers,
    highestProteinBurritos,
    highestProteinSalads,
    highestProteinPizza,
    parentCategories
  } = props;
  let meals = highestProteinBurgers;
  let topRestaurants = restaurants.slice(0, 15);

  let mealData = meals.map((meal) => {
    if (meal.variants.length > 0) {
      let fullName = `${meal.name} (${meal.variants[0].variantName})`;
      return { ...meal, ...meal.variants[0], name: fullName };
    } else return meal;
  });

  const [selectedMeals, setSelectedMeals] = useState(null);

  const [filters, setFilters] = useState([
    "Breakfast",
    "Burgers & Sandwiches",
    "Salads",
  ]);

  const handleFilter = (filter) => {
    filters.includes(filter)
      ? setFilters(filters.filter((value) => value !== filter))
      : setFilters(filters.concat(filter));
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

  // const filtereditems = items.filter(
  //   (item) =>
  //     (filters.includes("Beverages") && item.category === "Beverages") ||
  //     (filters.includes("Burgers & Sandwiches") &&
  //       item.category === "Burgers & Sandwiches") ||
  //     (filters.includes("Breakfast") && item.category === "Breakfast") ||
  //     (filters.includes("Salads") && item.category === "Salads") ||
  //     (filters.includes("Salads") && item.category === "Condiments")
  // );

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
        <RestaurantCloud restaurants={topRestaurants} />

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 mt-10">
          Top Lists
        </h2>
        <div
          role="list"
          className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8"
        >
          <div className="border rounded-lg shadow-md">
            <div className="text-center mt-8 mb-8 px-4">
              <h3 className="text-xl font-bold">
                Top 10 Highest Protein Burgers & Sandwiches ≤ 600 cal
              </h3>
              <p className="text-sm text-stone-500 mb-8">
                (Top 50 restaurant chains only)
              </p>
            </div>
            <table className="min-w-full divide-y divide-stone-300 rounded-lg overflow-hidden">
              <thead className="rounded-t-lg">
                <tr></tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {items.map((meal) => (
                  <MiniTableMealRow
                    meal={meal}
                    key={meal.restaurant.name + meal.name}
                    restaurantName={meal.restaurant.name}
                    restaurantSlug={meal.restaurant.slug}
                    showRestaurantData={true}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="border rounded-lg shadow-md">
            <div className="text-center mt-8 mb-8 px-4">
              <h3 className="text-xl font-bold text-center ">
                Top 10 Highest Protein Salads ≤ 500 cal
              </h3>
              <p className="text-sm text-stone-500 ">
                (Top 50 restaurant chains only)
              </p>
            </div>

            <table className="min-w-full divide-y divide-stone-300 rounded-lg  overflow-hidden">
              <thead className="rounded-t-lg">
                <tr></tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {highestProteinSalads.map((meal) => (
                  <MiniTableMealRow
                    meal={meal}
                    key={meal.restaurant.name + meal.name}
                    restaurantName={meal.restaurant.name}
                    restaurantSlug={meal.restaurant.slug}
                    showRestaurantData={true}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="border rounded-lg shadow-md">
            <div className="text-center mt-8 mb-8 px-4">
              <h3 className="text-xl font-bold text-center">
                Top 10 Highest Protein Pizzas ≤ 600 cal
              </h3>
              <p className="text-sm text-stone-500 ">
                (Top 50 restaurant chains only)
              </p>
            </div>
            <table className="min-w-full divide-y divide-stone-300 rounded-lg  overflow-hidden">
              <thead className="rounded-t-lg">
                <tr></tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {highestProteinPizza.map((meal) => (
                  <MiniTableMealRow
                    meal={meal}
                    key={meal.restaurant.name + meal.name}
                    restaurantName={meal.restaurant.name}
                    restaurantSlug={meal.restaurant.slug}
                    showRestaurantData={true}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="border rounded-lg shadow-md">
            <div className="text-center mt-8 mb-8 px-4">
              <h3 className="text-xl font-bold text-center">
                Top 10 Highest Protein Burritos ≤ 600 cal
              </h3>
              <p className="text-sm text-stone-500">
                (Top 50 restaurant chains only)
              </p>
            </div>
            <table className="min-w-full divide-y divide-stone-300 rounded-lg  overflow-hidden">
              <thead className="rounded-t-lg">
                <tr></tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {highestProteinBurritos.map((meal) => (
                  <MiniTableMealRow
                    meal={meal}
                    key={meal.restaurant.name + meal.name}
                    restaurantName={meal.restaurant.name}
                    restaurantSlug={meal.restaurant.slug}
                    showRestaurantData={true}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center pt-8">

        {/* <Link href="/restaurants" >
          <div className="bg-red-500 cursor-pointer hover:bg-red-700 text-white text-xl font-medium py-4 px-5 rounded-lg mx-auto max-w-lg">
            Find More Lists
          </div>
       </Link> */}
      </div>
       <section className="max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-10 mt-10">
          Food Categories
        </h2>

      <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      {parentCategories.filter((c)=>(c.name!== "Uncategorized")).map((category) => (
        <li key={category.slug} className="relative">
          <a href={`/category/${category.slug}`}>
          <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
            <div className="h-28 md:h-40">
            <img src={`/images/categoriesLarge/${category.slug}.jpg`} alt="" className="object-cover pointer-events-none group-hover:opacity-75" />
            </div>
            <button type="button" className="absolute inset-0 focus:outline-none">
              <span className="sr-only">{category.name}</span>
            </button>
          </div>
          </a>
          <p className="mt-2 block text-lg font-medium text-gray-900 truncate pointer-events-none">{category.name}</p>
          {/* <p className="block text-sm font-medium text-gray-500 pointer-events-none">{file.size}</p> */}
        </li>
      ))}
    </ul>
    <div className="flex items-center justify-center mt-8">
        <Link href="/category" >
          <div className="bg-red-500 cursor-pointer hover:bg-red-700 text-white text-xl font-medium py-4 px-5 rounded-lg mx-auto">
            See all Categories
          </div>
       </Link>
      </div>
</section>
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
  } else if (
    ["Chicken Nuggets", "Chicken Nuggets & Strips"].includes(category)
  ) {
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
  } else if (["Happy Meals", "Kid's Meal"].includes(category)) {
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
