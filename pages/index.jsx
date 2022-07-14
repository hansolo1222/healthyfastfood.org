import Head from "next/head";
import Image from "next/image";
//import styles from '../styles/Home.module.css'
import Header from "../components/Header";
import Layout from "../components/Layout";

import { useState } from "react";
import { useSortableData } from "../components/UseSortableData";
import { useFilteredData } from "../components/UseFilteredData";
const mcdonalds = require("/public/data/mcdonalds.json");
const starbucks = require("/public/data/starbucks.json");
const taco_bell = require("/public/data/taco-bell.json");

import RestaurantCloud from "../components/RestaurantCloud";
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  let combined = [...mcdonalds];

  console.log(combined);

  let data = combined.map((m) => {
    if (m.variants) {
      // const meal_name = `${m.meal_name} `;
      const merge = {
        restaurant_name: m.restaurant_name,
        restaurant_slug: m.restaurant_slug,
        meal_name: m.meal_name,
        category: m.category,
        slug: m.slug,
        ...m.variants[0],
      };

      return merge;
    } else return m;
  });

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
  } = useSortableData(data);

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
        <RestaurantCloud />

        <h2 className="text-3xl font-bold text-center mb-8 mt-8">
          Most popular meals
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
          <thead className="bg-stone-50 rounded-t-lg">
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
                      colKey="restaurant"
                      name="Restaurant"
                    />
                  </div>
                  <div className="ml-2">
                    <SortableTableHeader colKey="meal_name" name="Name" />
                  </div>
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-0.5 text-sm font-semibold text-stone-900"
              >
                <SortableTableHeader colKey="category" name="Type" />
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
                  colKey="total_carbohydrates"
                  name="Total Carbs"
                />
              </th>
              <th
                scope="col"
                className="py-0.5 text-left text-sm font-semibold text-stone-900"
              >
                <SortableTableHeader colKey="total_fat" name="Total Fat" />
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
              <MealRow meal={meal} key={meal.name} router={router}/>
            ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
}

const categoryTag = (category) => {
  if (category == "Burgers & Sandwiches") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        🍔 Sandwiches
      </span>
    );
  }
  if (category == "Breakfast") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        🍳 Breakfast
      </span>
    );
  }
  if (category == "Beverages") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        🥤 Beverages
      </span>
    );
  }
  if (category == "Desserts") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        🍦 Desserts
      </span>
    );
  }
  if (category == "Salads") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        🥗 Salads
      </span>
    );
  }
  if (category == "Condiments") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
        🧂 Condiments
      </span>
    );
  }
  if (category.includes("Coffee")) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
        ☕ Coffee
      </span>
    );
  }
  if (category.includes("Sides")) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
        🍟 Sides
      </span>
    );
  }
  if (category.includes("Chicken Nuggets")) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
        🐔 Chicken Nuggets
      </span>
    );
  }
  if (category.includes("Hacks")) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800">
        🎁 Limited Edition
      </span>
    );
  }
};


export const MealRow = ({ meal, router }) => {

  return (

    <tr className="mealRow cursor-pointer hover:bg-stone-50" onClick={()=>router.push(`/${meal.restaurant_slug}/${meal.slug}`)}>
      <td className=" py-1.5 text-md text-stone-900">
        <div className="flex items-center">
          <a href={`/${meal.restaurant_slug}`} className="flex items-center">
            <Image
              className=" flex-shrink-0 rounded-full mr-2"
              src={`/images/restaurant_logos/${meal.restaurant_slug}.webp`}
              alt={`${meal.restaurant_name} Logo`}
              width="24"
              height="24"
            />
          </a>

          <a
            href={`/${meal.restaurant_slug}/${meal.slug}`}
            className="hover:text-red-500 ml-3"
          >
            <div className="text-xs text-stone-500">{meal.restaurant_name}</div>{" "}
            <span className="">{meal.meal_name}</span>
          </a>
        </div>
      </td>
      <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
        {categoryTag(meal.category)}
      </td>
      <td className=" py-1 text-md text-stone-900 text-center">
        {meal.calories} <span className="text-stone-500 text-sm">cal</span>
      </td>
      <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
        {meal.protein} <span className="text-stone-500 text-sm">g</span>
      </td>
      <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
        {meal.total_carbohydrates}{" "}
        <span className="text-stone-500 text-sm">g</span>
      </td>
      <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
        {meal.total_fat} <span className="text-stone-500 text-sm">g</span>
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
