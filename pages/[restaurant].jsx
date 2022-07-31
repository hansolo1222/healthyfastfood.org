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
import { MealRow, formatCategory, formatParentCategory } from ".";
import { useRouter } from "next/router";
import { Breadcrumbs } from "../components/Breadcrumbs";
import prisma from "../lib/prisma";
import { NextSeo } from "next-seo";
import {Tabs} from "../components/Tabs";
export const getServerSideProps = async (context) => {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: [
      {
        rank: "asc",
      },
    ],
  });
  const data = await prisma.restaurant.findUnique({
    where: {
      slug: String(context.params?.restaurant),
    },
    include: {
      meals: {
        include: {
          category: true,
          variants: true,
        },
      },
    },
  });

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: JSON.parse(JSON.stringify(data)),
      restaurants: JSON.parse(JSON.stringify(restaurants)),
    },
  };
};

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

  const { data, restaurants } = props;

  let meals = data.meals;
  let categories = [...new Set(meals.map((item) => item.category.name))];

  const pages = [
    { name: "All Restaurants", href: `/restaurants` },
    { name: data.name, href: `/${data.slug}` },
  ];

  // format meals with variants
  let mealData = meals.map((meal) => {
    if (meal.variants.length > 0) {
      let fullName = `${meal.name} (${meal.variants[0].variantName})`;
      return { ...meal, ...meal.variants[0], name: fullName };
    } else return meal;
  });

  const [selectedMeals, setSelectedMeals] = useState(null);

  const [filters, setFilters] = useState([]);
  const [allergens, setAllergens] = useState([]);

  const [allSelected, setAllSelected] = useState(true);

  const handleFilter = (filter) => {
    setFilters(filter);

    // filters.includes(filter)
    //   ? setFilters(filters.filter((value) => value !== filter))
    //   : setFilters(filters.concat(filter));
  };

  const handleAllergens = (event) => {
    let allergen = event.target.id
   
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

  

  const filteredItems = items.filter((item) => {
    if (filters.length == 0) {
      return true;
    } else {
      return categories
        .map((c) => {
          return filters.includes(c) && item.category.name === c;
        })
        .includes(true);
    }
    // (filters.includes("Salads") && item.category === "Salads") || ... <-- They look like this
  }).filter((item)=>{
    if (allergens.length == 0){
      return true;
    } else {

     console.log( allergens.map((allergen)=>{
        return item.allergensFalse.includes(allergen)
      })
      )

      return !allergens.map((allergen)=>{
        return item.allergensFalse.includes(allergen)
      })
      .includes(false)
    }
  });

  return (
    <div className="">
      <NextSeo
        title={`${data.name} Nutrition Facts and Calories | HealthyFastFood`}
        description={`Discover nutrition facts, macros, and the healthiest items at ${data.name}`}
        canonical={`https://healthyfastfood.org/${data.slug}`}
        additionalMetaTags={[
          {
            property: "keywords",
            content: `${data.slug},nutrition,facts,`,
          },
        ]}
        openGraph={{
          url: "https://healthyfastfood.org/" + data.slug,
          type: "website",
          title:
            data.name +
            " Menu Nutrition Facts and Calories | Healthy Fast Food",
          description:
            "Discover nutrition facts, macros, and the healthiest items at " +
            data.name,
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
        <meta name="description" content="" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex">
          <aside className="shrink-0 pr-8 pb-10">
            <div className="mt-8 rounded-xl p-2 whitespace-wrap w-48 text-sm shadow-md bg-stone-50 flex">
            <div className="text-2xl">🍖</div>
            <div className="ml-2 text-stone-700">Healthy and High Protein Meals at McDonald's</div>
            </div>
            <div className="mt-8 bg-stone-50 rounded-xl p-2">
              <h2 className="text-stone-500 text-xs uppercase font-semibold p-2 ">
                Most Popular
              </h2>
              {restaurants.slice(0, 30).map((restaurant) => (
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
            </div>
          </aside>
          <main className="mt-8 w-full">
            <div className="flex items-center">
              <div className="relative w-14 h-14 mr-4">
                <Image
                  className=" flex-shrink-0 rounded-md mr-2 z-0"
                  src={`/images/logosSmall/${data.slug}.webp`}
                  alt={`${data.name} Logo`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div>
                <Breadcrumbs pages={pages} />
                <h1 className="text-3xl font-bold mt-1">
                  {data.name} Menu Nutrition Facts & Calories
                </h1>
              </div>
            </div>

            <div className="mt-4">
              <Tabs activeTab="all" />
            </div>

            {/* <p className="text-stone-500 mt-2 mb-2">
                Nutrition information for all menu tems from {data.name}.
                Discover which meals are healthiest. Click on meal items for
                more details.
              </p> */}

            <article className="">
              <div className="mt-4 mb-0">
                <div className="space-x-1">
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
                          {formatParentCategory(category, false)}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <section className="mt-4 mb-0 space-x-1">
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
                  </div>
               </section>



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
                  {filteredItems.length > 0 ? filteredItems.map((meal) => (
                    <MealRow
                      restaurantName={data.name}
                      restaurantSlug={data.slug}
                      showRestaurantData={true}
                      meal={meal}
                      key={meal.mealName}
                    />
                  )) : <tr className="">
                  <td colSpan={8} className="single-cell-row text-lg text-stone-500 text-center p-10">Sorry! It looks like we don&apos;t have this data yet.</td>
                  </tr>}
                </tbody>
              </table>
            </article>
          </main>
        </div>
      </Layout>
    </div>
  );
}
