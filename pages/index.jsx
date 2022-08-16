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
import { TableHeaders, TableMealRow } from "../components/TableMealRow";

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


  let mealData = meals.map((meal) => {
    if (meal.variants.length > 0) {
      let fullName = `${meal.name} (${meal.variants[0].variantName})`
      return {...meal, ...meal.variants[0], name: fullName}
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
              <TableMealRow meal={meal} key={meal.restaurant.name+meal.name} restaurantName={meal.restaurant.name} restaurantSlug={meal.restaurant.slug} showRestaurantData={true}/>
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
              <TableMealRow meal={meal} key={meal.restaurant.name+meal.name} restaurantName={meal.restaurant.name} restaurantSlug={meal.restaurant.slug} showRestaurantData={true}/>
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

