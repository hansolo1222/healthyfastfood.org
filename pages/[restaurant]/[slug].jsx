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
import { PieChart } from 'react-minimal-pie-chart';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export const getServerSideProps = async (context) => {
  // const router = useRouter()

  // console.log(router.query)

  console.log(context);

  const restaurant_slug = context.resolvedUrl.split("/")[1];

  const slug = context.params?.slug;

  const data = require("/public/data/" + restaurant_slug + ".json");

  const meal = data.find((d) => d.slug == slug);

  if (meal == undefined) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      meal: meal,
    },
  };
};

export default function Meal(props) {
  const { meal } = props;

   const pages = [
    { name: "All Restaurants", href: `/restaurants` },
    { name: meal.restaurant_name, href: `/${meal.restaurant_slug}`},
    { name: meal.meal_name, href: `/${meal.restaurant_slug}/${meal.slug}`},
  ]

  const shiftSize = 7;

  const data = {
    labels: [
      'Carbohydrates',
      'Protein',
      'Fat'
    ],
    datasets: [{
      label: 'Macro Breakdown',
      data: [meal.total_carbohydrates, meal.protein, meal.total_fat],
      backgroundColor: [
        '#E38627',
        '#6A2135',
        '#C13C37'
      ],
      hoverOffset: 4
    }],
    legend: {
      position: 'bottom',
    },
    responsive: true,
    options: {
      title: {
        display: true,
        text: 'Predicted world population (millions) in 2050'
      }
    }
  };

   {/* <PieChart
                  radius={PieChart.defaultProps.radius - shiftSize}
                  label={({ dataEntry }) => dataEntry.value + "g"}
                  data={[
                    { title: 'Protein', value: meal.protein, color: '#6A2135' },
                    { title: 'Fat', value: meal.total_fat, color: '#C13C37' },
                    { title: 'Carbohydrates', value: meal.total_carbohydrates, color: '#E38627' },
                  ]}
                />; */}


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
        <div className="flex">
          <div
            className="hidden lg:inline z-20 inset-0 top-[3.8125rem]
           right-auto w-[19.5rem] pr-8
           pb-10 overflow-y-auto"
          >
            <nav className="lg:text-sm lg:leading-6 w-full">
              <div className="mt-8">
                <h4 className="mb-8 lg:mb-3 font-semibold text-slate-900 dark:text-slate-200">
                  Popular Restaurants
                </h4>
                <ul>
                  {restaurants.default.map((e) => (
                    <li>
                      <a
                        href={`/${e.slug}`}
                        className="cursor-pointer block border-l pl-4 -ml-px border-transparent hover:border-slate-400  text-slate-600 hover:text-slate-900 "
                      >
                        {e.restaurant_name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
          <main>
            <div className="mt-8 pb-8 border-b">
                    <Breadcrumbs pages={pages}/>
              <div className="flex mt-4">
              {/* <div className="h-48 w-48 bg-slate-50 rounded-lg"> */}
              <div className="w-48 h-48 relative border rounded-xl bg-white">

                <Image src={`/images/meals/${meal.restaurant_slug}/${meal.slug}.webp`}
                alt={`${meal.name}`}
               layout="fill"
               objectFit="contain"
               width='100%'
                />

              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold">
                  {meal.meal_name} Nutrition Facts
                </h1>
                <p className="text-stone-500 mt-4">Find out nutrition information for the {meal.restaurant_slug} {meal.meal_name}, macro breakdown, alternatives, and where to get it right now.</p>

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
                        {meal.total_fat}g
                      </div>
                    </dd>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-base font-normal text-stone-900">
                      Total Carbs
                    </dt>
                    <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                      <div className="flex items-baseline text-2xl font-semibold text-green-600">
                        {meal.total_carbohydrates}g
                      </div>
                    </dd>
                  </div>
                </dl>

              </div>
              </div>
            </div>
            <div className="grid-cols-3 grid gap-8 mt-8">
              <div className="max-w-md col-span-1">
                <NutritionFacts data={meal} />
              </div>
              <div className="col-span-1">
                <div className="bg-stone-50 p-5 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Macros</h2>
                  <Pie data={data}/>
                </div>
                
              </div>
            </div>
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

const MealRow = ({ meal }) => {
  return (
    <tr className="minerDataRow">
      <td className="whitespace-nowrap px-3 py-1.5 text-md text-stone-900">
        <div className="flex items-center">
          <Image
            className=" flex-shrink-0 rounded-full mr-2"
            src={`/images/restaurant_logos/${meal.restaurant_slug}.svg`}
            alt={`${meal.restaurant_name} Logo`}
            width="24"
            height="24"
          />
          <div className="ml-2">
            <span className="text-stone-500">{meal.restaurant_name}</span>{" "}
            <span className="font-medium">{meal.meal_name}</span>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
        {categoryTag(meal.category)}
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
        {meal.calories} <span className="text-stone-500 text-sm">cal</span>
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
        {meal.protein} <span className="text-stone-500 text-sm">g</span>
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
        {meal.total_carbohydrates}{" "}
        <span className="text-stone-500 text-sm">g</span>
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
        {meal.total_fat} <span className="text-stone-500 text-sm">g</span>
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
        {meal.cholesterol} <span className="text-stone-500 text-sm">mg</span>
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
        {meal.sodium} <span className="text-stone-500 text-sm">mg</span>
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-stone-900 text-center">
        {meal.sugar} <span className="text-stone-500 text-sm">g</span>
      </td>
    </tr>
  );
};
