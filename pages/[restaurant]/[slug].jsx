import Head from "next/head";
import Image from "next/image";
//import styles from '../styles/Home.module.css'
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import NutritionFacts from "../../components/NutritionFacts";
import { useState } from "react";
import { useRouter } from "next/router";
import * as restaurants from "../../public/restaurant_links.json" assert { type: "json" };
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { PieChart } from "react-minimal-pie-chart";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { NextSeo } from "next-seo";
import prisma from "../lib/prisma"

ChartJS.register(ArcElement, Tooltip, Legend);

export const getServerSideProps = async (context) => {
  // const router = useRouter()

  const mealData = await prisma.meal.findUnique({
    where: {
      restaurantSlug_slug: {
        restaurantSlug: context.resolvedUrl.split("/")[1],
        slug: context.resolvedUrl.split("/")[2],
      },
    },
    include: {
      restaurant: true,
      category: true,
      variants: true,
    },
  });

  const category = mealData.category.name;
  const mealsInCategory = await prisma.meal.findMany({
    where: {
      category: {
        name: category,
      },
    },
  });

  const topRestaurants = await prisma.restaurant.findMany({
    orderBy: [
      {
        rank: "asc",
      },
    ],
  });

  if (mealData == undefined) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      meal: JSON.parse(JSON.stringify(mealData)),
      mealsInCategory: JSON.parse(JSON.stringify(mealsInCategory)),
      topRestaurants: JSON.parse(JSON.stringify(topRestaurants)),
    },
  };
};

export default function Meal(props) {
  const { meal, mealsInCategory, topRestaurants } = props;
  let restaurant = meal.restaurant;

  const pages = [
    { name: "All Restaurants", href: `/restaurants` },
    { name: restaurant.name, href: `/${restaurant.slug}` },
    { name: meal.name, href: `/${restaurant.slug}/${meal.slug}` },
  ];

  console.log(meal.variants.length);

  const data = {
    labels: ["Carbohydrates", "Protein", "Fat"],
    datasets: [
      {
        label: "Macro Breakdown",
        data: [meal.totalCarbohydrates, meal.protein, meal.totalFat],
        backgroundColor: ["#E38627", "#6A2135", "#C13C37"],
        hoverOffset: 4,
      },
    ],
    legend: {
      position: "bottom",
    },
    responsive: true,
    options: {
      title: {
        display: true,
        text: "Macro nutrient breakdown",
      },
    },
  };

  return (
    <div className="">
    <NextSeo
        title={`${restaurant.name} ${meal.name} Nutrition Facts and Calories | Healthy Fast Food`}
        description={`${restaurant.name} ${meal.name} Nutrition facts, calories, protein, fat and carbs. Discover nutrition facts, macros, and the healthiest items at ${data.name}`}
        canonical={`https://healthyfastfood.org/${restaurant.slug}/${meal.slug}`}
        additionalMetaTags={[
          {
            property: "keywords",
            content:
              `${restaurant.name},${meal.name},healthy, fast food,nutrition facts,calories,protein,fat,carbohydrates,dietary fiber,sugars,vitamin a,vitmain c, iron, calcium,healthy choices`,
          },
        ]}
        openGraph={{
          url: "https://healthyfastfood.org/" + restaurant.slug + "/" + meal.slug,
          type: "website",
          title:
            restaurant.name + " " + meal.name +
            " Nutrition Facts and Calories | Healthy Fast Food",
          description:
            "How many calories are in the " + restaurant.name + " " + meal.name + "? Is it healthy?",
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
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex">
          <div
            className="shrink-0 z-20 pr-8 pb-10"
          >
              <div className="mt-8 bg-stone-50 rounded-xl p-2">

              <h2 className="text-stone-500 text-xs uppercase font-semibold p-2 ">Most Popular</h2>
               {topRestaurants.slice(0,30)
               .map((restaurant)=>(
               
                <div className="hover:bg-stone-200 p-2 rounded-xl" key={restaurant.slug}>
                <a href={`/${restaurant.slug}`} className="cursor-pointer w-full flex items-center" key={restaurant.slug}>
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
                    <div className="pl-2 text-stone-500 text-sm">{restaurant.name}</div>
                  </a>
                  </div>
                 
               
                ))} 
               
                {/* <h4 className="mb-8 mt-4 lg:mb-3 font-semibold text-slate-900 dark:text-slate-200">
                  Similar Items
                </h4>
                <ul>
                  {mealsInCategory.slice(0, 15).map((meal) => (
                    <li key={meal.slug}>
                      <a
                        href={`/${restaurant.slug}/${meal.slug}`}
                        className="whitespace-nowrap cursor-pointer block border-l pl-4 -ml-px border-transparent hover:border-slate-400  text-slate-600 hover:text-slate-900 "
                      >
                        {meal.name}
                      </a>
                    </li>
                  ))}
                </ul> */}
              </div>
          </div>
          <main>
            <div className="mt-8 pb-8 border-b">
              <Breadcrumbs pages={pages} />
              <div className="flex mt-4">
                {/* <div className="h-48 w-48 bg-slate-50 rounded-lg"> */}
                <div className="w-48 h-48 relative border rounded-xl bg-white">
                  <Image
                    src={`/images/meals/${restaurant.slug}/${meal.slug}.webp`}
                    alt={`${meal.name}`}
                    layout="fill"
                    objectFit="contain"
                    width="100%"
                  />
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold">
                    {meal.name} Nutrition Facts
                  </h1>
                  <p className="text-stone-700 mt-4 text-lg">
                    Find out nutrition information for the {restaurant.name}{" "}
                    {meal.name}, macro breakdown, alternatives, and where to get
                    it right now.
                  </p>
                  <p className="text-stone-500 mt-4 ">
                    The {restaurant.name} {meal.name} has{" "}
                    <b>{meal.calories} calories</b>, <b>{meal.protein}g</b> of
                    protein, <b>{meal.totalCarbohydrates}g</b> of cabohydrates
                    and <b>{meal.totalFat}g</b> of fat. Thats a protein to carb
                    ratio of{" "}
                    {(meal.protein / meal.totalCarbohydrates).toFixed(2)}
                  </p>
                  .
                  <p>
                    The acceptable macronutrient distribution ranges (AMDR) are
                    45–65% of your daily calories from carbs, 20–35% from fats
                    and 10–35% from protein.
                  </p>
                  {meal.variants.length == 0 && (
                    <dl className="mt-5 grid rounded-lg bg-white overflow-hidden border border-stone-200 divide-y divide-stone-200 grid-cols-2 md:grid-cols-4 md:divide-y-0 md:divide-x">
                      <div className="px-4 py-5 sm:p-6">
                        <dt className="text-base font-normal text-stone-900">
                          Calories
                        </dt>
                        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                          <div className="flex items-baseline text-2xl font-semibold text-green-600">
                            {meal.calories} kcal
                          </div>
                        </dd>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <dt className="text-base font-normal text-stone-900">
                          Protein
                        </dt>
                        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                          <div className="flex items-baseline text-2xl font-semibold text-green-600">
                            {meal.protein}g
                          </div>
                        </dd>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <dt className="text-base font-normal text-stone-900">
                          Total Fat
                        </dt>
                        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                          <div className="flex items-baseline text-2xl font-semibold text-green-600">
                            {meal.totalFat}g
                          </div>
                        </dd>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <dt className="text-base font-normal text-stone-900">
                          Total Carbs
                        </dt>
                        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                          <div className="flex items-baseline text-2xl font-semibold text-green-600">
                            {meal.totalCarbohydrates}g
                          </div>
                        </dd>
                      </div>
                    </dl>
                  )}
                </div>
              </div>
            </div>

            {meal.variants.length > 0 ? (
              <>
              <h2 className="font-bold text-2xl mt-8 mb-6">Variations</h2>

              <div className="grid grid-cols-3 gap-8">
                {meal.variants.map((variant) => {
                  return (
                    <div className="bg-stone-50 rounded-xl p-4" key={variant.variantName}>
                      <h3 className="text-xl font-bold">
                        {variant.variantName}
                      </h3>
                      <div className="flex justify-between items-center border-b py-2">
                        <dt className="text-base font-normal text-stone-900">
                          Calories
                        </dt>
                        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                          <div className="flex items-baseline text-2xl font-semibold text-green-600">
                            {variant.calories} kcal
                          </div>
                        </dd>
                      </div>
                      <div className="flex justify-between items-center border-b py-2">
                        <dt className="text-base font-normal text-stone-900">
                          Protein
                        </dt>
                        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                          <div className="flex items-baseline text-xl font-semibold text-green-600">
                            {variant.protein}g
                          </div>
                        </dd>
                      </div>
                      <div className="flex justify-between items-center border-b py-2">
                        <dt className="text-base font-normal text-stone-900">
                          Carbs
                        </dt>
                        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                          <div className="flex items-baseline text-xl font-semibold text-green-600">
                            {variant.totalCarbohydrates}g
                          </div>
                        </dd>
                      </div>
                      <div className="flex justify-between items-center border-b py-2">
                        <dt className="text-base font-normal text-stone-900">
                          Fat
                        </dt>
                        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                          <div className="flex items-baseline text-xl font-semibold text-green-600">
                            {variant.totalFat}g
                          </div>
                        </dd>
                      </div>
                      <div className="flex justify-center">
                        <button className="bg-red-500 hover:bg-red-700 text-white text-lg font-medium py-2 px-4 rounded mx-auto text-center mt-4">
                          View All Nutrition Facts
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              </>
            ) : (
              <div className="grid-cols-3 grid gap-8 mt-8">
              <div className="max-w-md col-span-1">
                <NutritionFacts data={meal} />
              </div>
              <div className="col-span-1">
                <div className="bg-stone-50 p-5 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Macros</h2>
                  <Pie data={data} />
                </div>
              </div>
            </div>
            )}

            
            Item availability varies by location.

            Calories will vary based on modifications made to item. Product availability, prices, offers and discounts may vary from in-restaurant. BK printed coupons not valid on online orders.

            2,000 calories a day is used for general nutrition advice, but calorie needs vary. For additional nutrition information click here.
            Warning:  indicates that sodium (salt) content of this item is higher than the total daily recommended limit (2,300mg). High Sodium intake can increase blood pressure and risk of heart disease and stroke.
          </main>
        </div>
      </Layout>
    </div>
  );
}

const categoryTag = (category) => {
  if (category == "Burgers & Sandwiches") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        🍔 Burgers & Sandwiches
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
