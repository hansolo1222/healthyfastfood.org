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
import prisma from "../../lib/prisma"
import { PlusIcon, MinusIcon } from "@heroicons/react/outline";

import { MealTabs } from "../../components/Tabs";


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

  // if (mealData == undefined) {
  //   return {
  //     notFound: true,
  //   };
  // }
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

  const [src, setSrc] = useState(`/images/meals/${restaurant.slug}/${meal.slug}.webp`);


  return (
    <div className="">
    <NextSeo
        title={`${meal.name}: Nutrition Facts and Calories | ${restaurant.name}`}
        description={`${restaurant.name} ${meal.name} Nutrition facts, calories, protein, fat and carbs. Discover nutrition facts, macros, and the healthiest items.`}
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
          <aside
            className="shrink-0 z-20 pr-8 pb-10"
          >
              <div className="mt-8 bg-stone-50 rounded-xl p-2">

              <h2 className="text-stone-500 text-xs uppercase font-semibold p-2 ">Most Popular</h2>
               {topRestaurants.slice(0,30)
               .map((restaurant)=>(
               
                <div className="hover:bg-stone-200 rounded-xl" key={restaurant.slug}>
                <a href={`/${restaurant.slug}`} className="cursor-pointer w-full flex items-center p-2" key={restaurant.slug}>
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
          </aside>
          <main>
            <section className="mt-8 pb-8">
              <div className="flex mt-4">
                {/* <div className="h-48 w-48 bg-slate-50 rounded-lg"> */}
                <div className="">
                  <Image
                    src={src}
                    alt={`${meal.name}`}
                    height='250px' 
                    width='250px' 
                    objectFit="contain"
                    className="border"
                    onError={() => setSrc("/images/categories/" + meal.category.parentCategorySlug + ".webp")}
                    // onError={({ currentTarget }) => {
                    //     currentTarget.onerror = null; // prevents looping
                    //     currentTarget.src="/images/burger.jpeg";
                    //   }}
                  />
                </div>
                <div className="ml-6">
                   <Breadcrumbs pages={pages} />

                  <h1 className="text-3xl font-bold mt-1">
                    {meal.name} <span className="text-stone-500 font-normal">Nutrition Facts & Calories</span>
                  </h1>
                  <p className="text-stone-500 mt-4">
                    Use this page to instantly find <b>nutrition information</b> and <b>healthier alternatives</b> to the {restaurant.name}{" "}
                    {meal.name}.

                  </p>
                  <p className="text-stone-500 mt-4 ">
                    The {restaurant.name} {meal.name} has{" "}
                    <b>{meal.calories} calories</b>, <b>{meal.protein}g</b> of
                    protein, <b>{meal.totalCarbohydrates}g</b> of carbohydrates
                    and <b>{meal.totalFat}g</b> of fat.
                  </p>
                  <p className="text-stone-500 mt-4">
                  Jump to:
                  </p>
                    <ul>
                      <li className="list-disc ml-4 ">
                        High Protein Meals at {restaurant.name}
                      </li>
                      <li className="list-disc ml-4">
                        Low Fat Meals at {restaurant.name}
                      </li>
                      <li className="list-disc ml-4">
                        Healthiest {meal.category.name} at {restaurant.name}
                      </li>

                    </ul>
                  
                  
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
            </section>
              <MealTabs activeTab="nutrition-information" slug="" />
            <section>
            <h2 className="font-bold text-2xl mb-6 pt-8">Nutrition Information</h2>
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
                  <h3 className="text-xl font-bold mb-4">Macros Breakdown</h3>
                  <Pie data={data} />
                  The acceptable macronutrient distribution ranges (AMDR) are
                    45–65% of your daily calories from carbs, 20–35% from fats
                    and 10–35% from protein.
                </div>
              </div>
            </div>
            )}
          </section>

          <section>
            <h2 className="font-bold text-2xl mt-8 mb-6 pt-8 border-t">Allergens</h2>
            <div className="grid-cols-3 grid gap-8 mt-8">
              <div className="bg-stone-50 p-5 rounded-lg">
              <h3 className="font-bold">This item contains:</h3>
                {meal.allergensTrue.map((allergen)=>(
                  <li className="list-none flex items-center" key={allergen}>
                    <PlusIcon className="h-5 w-5 mr-2"/>{allergen}
                  </li>
                )
                )}
              </div>
              <div className="bg-stone-50 p-5 rounded-lg">
              <h3 className="font-bold">This item does not contain:</h3>
                {meal.allergensFalse.map((allergen)=>(
                  <li className="list-none flex items-center" key={allergen}>
                  <MinusIcon className="h-5 w-5 mr-2"/>{allergen}
                  </li>
                )
                )}
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-2xl mt-8 mb-6 pt-8 border-t">Compare To</h2>
            <p className="text-xl">Find Alternatives to the {meal.name} at {restaurant.name}:</p>

            <p className="text-xl">Find Alternatives to the {meal.name} at other restaurants:</p>

          </section>

          <section>
            <h2 className="font-bold text-2xl mt-8 mb-6 pt-8 border-t">Ingredients</h2>
            <div dangerouslySetInnerHTML={{__html: meal.ingredients}}></div>
          </section>

          <section>
            <h2 className="font-bold text-2xl mt-8 mb-6 pt-8 border-t">About This Restaurant</h2>
          </section>

          <section>
            <h2 className="font-bold text-2xl mt-8 mb-6 pt-8 border-t">Frequently Asked Questions</h2>
            <h3 className="text-lg font-bold pb-4">How many calories are the in {meal.name}?</h3>
            <p className="pb-4">There are {meal.calories} calories in the {meal.name}.</p>
            <h3>What are the macros of this item?</h3>
            <h3>How many carbohydrates are in this item?</h3>
            <h3>How much protein does this item contain?</h3>
            <h3>How much fat is in this item?</h3>
            <h3>How many sodium is in this item?</h3>
            <h3>How much cholesterol is in this item?</h3>
            <h3>How much sugar is in this item?</h3>


          </section>
            <div>
            Please note that item availability varies by restaurant location.
            <br/><br/>
            Calories and other nutritional information will vary based on modifications made to item. Product availability, prices, offers and discounts may vary from in-restaurant. Before using coupons check if {restaurant.name} printed coupons are valid for online or food-delivery orders.
            <br/><br/>
            2,000 calories a day is used for general nutrition advice. Calorie and nutrient needs will vary depending on person. 
            <br/><br/>
            Warning: High Sodium intake can increase blood pressure and risk of heart disease and stroke.
            </div>

          </main>
        </div>
      </Layout>
    </div>
  )
}
