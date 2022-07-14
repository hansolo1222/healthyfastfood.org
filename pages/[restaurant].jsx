import Head from "next/head";
import Image from "next/image";
//import styles from '../styles/Home.module.css'
import Header from "../components/Header";
import Layout from "../components/Layout";
import { useState } from "react";
import { useSortableData } from "../components/UseSortableData";
import { useFilteredData } from "../components/UseFilteredData";
//let glob = require( 'glob' ), path = require( 'path' );
//import recursiveReaddirFiles from 'recursive-readdir-files';
import Link from "next/link";
import { MealRow } from ".";
import * as restaurants from '../public/restaurant_links.json' assert {type: "json"};
import { useRouter } from "next/router";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const getStaticProps = async (context) => {
  // temporary restaurant list
  //const restaurants = ["mcdonalds", "starbucks", "taco-bell"];

  const slug = context.params?.restaurant;
  const available_restaurants = restaurants.map((r)=>r.slug)
  if (!available_restaurants.includes(slug)) {
    return {
      notFound: true,
    };
  }
  const data2 = require("../public/data/arbys.json");


  console.log( "here")

  const data = require("../public/data/" + slug + ".json");

  return {
    props: {
      meals: data,
    },
  };
};

const formatCategoryName = (category) => {
  if (category == "Burgers & Sandwiches") {
    return "🍔 Sandwiches"
  }
  if (category == "Beverages") {
    return "🥤 Beverages"
  }
  if (category == "Breakfast") {
    return "🍳 Breakfast"
  }
  if (category == "Chicken Nuggets and Strips") {
    return "🐔 Chicken"
  }
  if (category == "Condiments") {
    return "🧂 Condiments"
  }
  if (category == "Desserts") {
    return "🍦 Desserts"
  }
  if (category == "Happy Meals") {
    return "👶 Happy Meals"
  }
  if (category == "McCafe Coffee") {
    return "☕ Coffee"
  }
  if (category == "Menu Hacks") {
    return "🎁 Limited Edition"
  }
  if (category == "Salads") {
    return "🥗 Salads"
  }
  if (category == "Snacks & Sides") {
    return "🍟 Sides"
  } else {
    return category
  }
}

export const getStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export default function Restaurant(props) {
  // glob.sync( '/data/**/*.js' ).forEach( function( file ) {
  //   require( path.resolve( file ) );
  // });


  const router = useRouter();

  const { meals } = props;

  let categories = [...new Set(meals.map((item)=>(item.category)) )];
  console.log(categories)
  const pages = [
    { name: "All Restaurants", href: `/restaurants` },
    { name: meals[0].restaurant_name, href: `/${meals[0].restaurant_slug}`},
  ]

  let data = meals.map((m) => {
    if (m.variants) {
      const meal_name = `${m.meal_name} `;
      const merge = {
        restaurant_name: m.restaurant_name,
        restaurant_slug: m.restaurant_slug,
        meal_name: m.meal_name,
        slug: m.slug,
        category: m.category,
        ...m.variants[0],
      };

      return merge;
    } else return m;
  });

  const [selectedMeals, setSelectedMeals] = useState(null);
  const [filters, setFilters] = useState(categories);

  const handleFilter = (filter) => {
    console.log(filter, "being added");
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
    (item) => {
      
      console.log(categories.map((c)=> 
        {return (filters.includes(c) && item.category === c)}
      ).includes(true))
      return categories.map((c)=> 
        {return (filters.includes(c) && item.category === c)}
      ).includes(true)

      // (filters.includes("Beverages") && item.category === "Beverages") ||
      // (filters.includes("Burgers & Sandwiches") &&
      //   item.category === "Burgers & Sandwiches") ||
      // (filters.includes("Breakfast") && item.category === "Breakfast") ||
      // (filters.includes("Salads") && item.category === "Salads") ||
      // (filters.includes("Salads") && item.category === "Condiments")
    }
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
        <title>{meals[0].restaurant_name} Nutrtion | Healthy Fast Food</title>
        <meta
          name="description"
          content=""
        />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex">
          <div className="hidden lg:inline z-20 inset-0 top-[3.8125rem]
           right-auto w-[19.5rem] pr-8
           pb-10 overflow-y-auto">
            <nav class="lg:text-sm lg:leading-6 w-full">
              <div class="mt-8">
                <h4 class="mb-8 lg:mb-3 font-semibold text-slate-900 dark:text-slate-200">Popular Restaurants</h4>
               <ul>
               {restaurants.default.map((e)=>(
                <li>
                  <a href={`/${e.slug}`} className="cursor-pointer block border-l pl-4 -ml-px border-transparent hover:border-slate-400  text-slate-600 hover:text-slate-900 ">
                  {e.slug}
                  </a>
                </li>
                ))} 
                </ul>
              </div>
            </nav>
           </div>
          <div className="">
            <div className="mt-8">
              <Breadcrumbs pages={pages}/>
              <h1 className="text-3xl font-bold mt-4">
                {meals[0].restaurant_name} Nutrition Facts and Rankings
              </h1>
              <p className="text-stone-500 mt-2">
                Discover and choose the healthiest items from{" "}
                {meals[0].restaurant_name}. Click on meal items for more
                details.
              </p>
              <div className="inline-block">
                <div className="flex space-x-1 mt-4 mb-4">
                  {/* <div>
                    <input
                      id="burgers"
                      type="checkbox"
                      checked={filters.includes("Burgers & Sandwiches")}
                      onChange={() => handleFilter("Burgers & Sandwiches")}
                    />
                    <label
                      htmlFor="burgers"
                      className="cursor-pointer inline-flex items-center px-3.5 py-0.5 rounded-md text-sm font-medium"
                    >
                      Burgers & Sandwiches
                    </label>
                  </div> */}
                  <div className="inline-block">
                  {categories.map((category)=>{
                    return <div className="inline-block mr-1 mb-1"><input
                      id={category}
                      type="checkbox"
                      checked={filters.includes(category)}
                      onChange={() => handleFilter(category)}
                    />
                    <label
                      htmlFor={category}
                      className="cursor-pointer inline-flex whitespace-nowrap items-center px-3.5 py-0.5 rounded-md text-sm font-medium "
                    >
                      {formatCategoryName(category)}
                    </label></div>
                  })}
                  </div>
                    {/* <input
                      id="breakfast"
                      type="checkbox"
                      checked={filters.includes("Breakfast")}
                      onChange={() => handleFilter("Breakfast")}
                    />
                    <label
                      htmlFor="breakfast"
                      className="cursor-pointer inline-flex items-center px-3.5 py-0.5 rounded-md text-sm font-medium "
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
                      className="cursor-pointer inline-flex items-center px-3.5 py-0.5 rounded-md text-sm font-medium "
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
                      className="cursor-pointer inline-flex items-center px-3.5 py-0.5 rounded-md text-sm font-medium "
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
                      className="cursor-pointer inline-flex items-center px-3.5 py-0.5 rounded-md text-sm font-medium "
                    >
                      Condiments
                    </label>
                  </div> */}
                </div>
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
                          <div className="ml-8">
                            <SortableTableHeader
                              colKey="restaurant"
                              name="Restaurant"
                            />
                          </div>
                          <div className="ml-2">
                            <SortableTableHeader
                              colKey="meal_name"
                              name="Name"
                            />
                          </div>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 text-sm font-semibold text-stone-900"
                      >
                        <SortableTableHeader colKey="category" name="Type" />
                      </th>
                      <th
                        scope="col"
                        className=" py-3.5 text-sm font-semibold text-stone-900"
                      >
                        <SortableTableHeader
                          colKey="calories"
                          name="Calories"
                        />
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
                        <SortableTableHeader
                          colKey="total_fat"
                          name="Fat"
                        />
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
                        <SortableTableHeaderInverse
                          colKey="sugar"
                          name="Sugar"
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white">
                    {filtereditems.map((meal) => (
                      <MealRow meal={meal} key={meal.meal_name} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

// const MealRow = ({ meal }) => {
//   return (
//     <tr className="minerDataRow">
//       <td className="whitespace-nowrap px-3 py-1.5 text-md text-stone-900">
//         <div className="flex items-center">
//           <Image
//             className=" flex-shrink-0 rounded-full mr-2"
//             src={`/images/restaurant_logos/${meal.restaurant_slug}.svg`}
//             alt={`${meal.restaurant_name} Logo`}
//             width="24"
//             height="24"
//           />
//             <div className="ml-2">
//               <a href={`/${meal.restaurant_slug}/${meal.slug}`} className="hover:text-red-500">
//                 <>
//                 <span className="">{meal.restaurant_name}</span>{" "}
//                 <span className="font-medium">{meal.meal_name}</span>
//                 </>
//               </a>
//             </div>
//         </div>
//       </td>
//       <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
//         {categoryTag(meal.category)}
//       </td>
//       <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
//         {meal.calories} <span className="text-stone-500 text-sm">cal</span>
//       </td>
//       <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
//         {meal.protein} <span className="text-stone-500 text-sm">g</span>
//       </td>
//       <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
//         {meal.total_carbohydrates}{" "}
//         <span className="text-stone-500 text-sm">g</span>
//       </td>
//       <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
//         {meal.total_fat} <span className="text-stone-500 text-sm">g</span>
//       </td>
//       <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
//         {meal.cholesterol} <span className="text-stone-500 text-sm">mg</span>
//       </td>
//       <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
//         {meal.sodium} <span className="text-stone-500 text-sm">mg</span>
//       </td>
//       <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
//         {meal.sugar} <span className="text-stone-500 text-sm">g</span>
//       </td>
//     </tr>
//   );
// };
