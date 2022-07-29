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
import { MealRow, formatCategory } from ".";
import { useRouter } from "next/router";
import { Breadcrumbs } from "../components/Breadcrumbs";
import prisma from "../lib/prisma"
import { NextSeo } from "next-seo";

export const getServerSideProps = async (context) => {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: [
      {
        rank: 'asc',
      },
    ]
  })  
  const data = await prisma.restaurant.findUnique({
    where: {
      slug: String(context.params?.restaurant),
    },
    include: {
      meals: {
        include: {
          category: true,
          variants: true
        }
      }
    }
  })

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: JSON.parse(JSON.stringify(data)),
      restaurants: JSON.parse(JSON.stringify(restaurants)),
    }
  }
}

const formatCategoryName = (category) => {
  if (category == "Burgers & Sandwiches" || category == "Sandwiches & Burgers") {
    return "🍔 Sandwiches"
  }
  if (category == "Beverages") {
    return "🥤 Beverages"
  }
  if (category == "Breakfast") {
    return "🍳 Breakfast"
  }
  if (category == "Seafood") {
    return "🍤 Seafood"
  }
  if (category == "Breads") {
    return "🍞 Breads"
  }
  if (category == "Sauces") {
    return "🥫 Sauces"
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
  if (category == "Happy Meals" || category == "Kids Menu") {
    return "👶 " + category
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
  if (category == "Snacks & Sides" || category == "Sides") {
    return "🥔 Sides"
  } else {
    return category
  }
}

export default function Restaurant(props) {

  const router = useRouter();

  const { data, restaurants } = props;

  let meals = data.meals
  let categories = [...new Set(meals.map((item)=>(item.category.name)) )];

  const pages = [
    { name: "All Restaurants", href: `/restaurants` },
    { name: data.name, href: `/${data.slug}`},
  ]

  console.log(meals)

 // format meals with variants
  let mealData = meals.map((meal) => {
    if (meal.variants.length > 0) {
      let fullName = `${meal.name} (${meal.variants[0].variantName})`
      return {...meal, ...meal.variants[0], name: fullName}
    } else return meal;
  });

  console.log(mealData)

  const [selectedMeals, setSelectedMeals] = useState(null);
  const [filters, setFilters] = useState(categories);

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

  const filtereditems = items.filter(
    (item) => {

      return categories.map((c)=> 
        {return (filters.includes(c) && item.category.name === c)}
      ).includes(true)

      // (filters.includes("Salads") && item.category === "Salads") || ... <-- They look like this
    }
  );


  return (
    <div className="">
    <NextSeo
        title={`${data.name} Nutrition Facts and Calories | Healthy Fast Food`}
        description={`Discover nutrition facts, macros, and the healthiest items at ${data.name}`}
        canonical={`https://healthyfastfood.org/${data.slug}`}
        additionalMetaTags={[
          {
            property: "keywords",
            content:
              `${data.slug},nutrition,facts,`,
          },
        ]}
        openGraph={{
          url: "https://healthyfastfood.org/" + data.slug,
          type: "website",
          title:
            data.name +
            " Menu Nutrition Facts and Calories | Healthy Fast Food",
          description:
            "Discover nutrition facts, macros, and the healthiest items at " + data.name,
          images: [
            {
              url: `/images/restaurant_logos/${data.slug}.webp`,
              width: 400,
              height: 400,
              alt: data.name + " Logo",
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
        <title>{data.name} Nutrition | Healthy Fast Food</title>
        <meta
          name="description"
          content=""
        />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex">
          <div className="hidden lg:inline z-20 inset-0 top-[3.8125rem]
           right-auto w-[19.5rem] pr-8 overflow-hidden
           pb-10 overflow-y-hidden">
            <nav className="lg:text-sm lg:leading-6 w-full">
              <div className="mt-8">
                <h4 className="mb-8 lg:mb-3 font-semibold text-slate-900 dark:text-slate-200">Popular Restaurants</h4>
               <ol>
               {restaurants.slice(0,30)
               .map((restaurant)=>(
                <a href={`/${restaurant.slug}`} className="cursor-pointer" key={restaurant.slug}>
                <li key={restaurant.slug} className="list-decimal flex items-center py-1 px-3 rounded-lg hover:bg-stone-100 hover:text-red-500">
                <div className="relative w-5 h-5">
                            <Image
                              className=" flex-shrink-0 rounded-md mr-1"
                              src={`/images/logosSmall/${restaurant.slug}.webp`}
                              alt={`${restaurant.name} Logo`}
                              layout="fill"
                              objectFit="contain"
                            />
                          </div>
                  <div className="pl-2">{restaurant.name}</div>
                </li>
                </a>
                ))} 
                </ol>
              </div>
            </nav>
           </div>
          <main className="">
            <div className="mt-8">
              <Breadcrumbs pages={pages}/>
              <div className="flex items-center mt-4">
                <div className="relative w-10 h-10 mr-4">
                <Image
                  className=" flex-shrink-0 rounded-md mr-2"
                  src={`/images/logosSmall/${data.slug}.webp`}
                  alt={`${data.name} Logo`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h1 className="text-3xl font-bold">
                {data.name} Menu Nutrition Facts & Calories
              </h1>
            </div>
              
              <p className="text-stone-500 mt-2">
                Nutrition information for all menu tems from{" "}
                {data.name}. Discover which meals are healthiest. Click on meal items for more
                details.
              </p>
              <div className="inline-block">
                <div className="flex space-x-1 mt-4 mb-4">
        
                  <div className="inline-block">
                  {categories.map((category)=>{
                    return <div className="inline-block mr-1 mb-1" key={category}><input
                      id={category}
                      type="checkbox"
                      checked={filters.includes(category)}
                      onChange={() => handleFilter(category)}
                    />
                    <label
                      htmlFor={category}
                      className="cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-1 rounded-md text-sm font-medium "
                    >
                      {formatCategory(category, false)} 
                    </label></div>
                  })}
                  </div>
 
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
                          {/* <div className="ml-8">
                            <SortableTableHeader
                              colKey="restaurant"
                              name="Restaurant"
                            />
                          </div> */}
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
                      <MealRow restaurantName={data.name} restaurantSlug={data.slug} showRestaurantData={false} meal={meal} key={meal.mealName} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </div>
  );
}
