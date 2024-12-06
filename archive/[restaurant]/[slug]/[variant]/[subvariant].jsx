import Head from "next/head";
import Layout from "../../../../components/Layout";

import { NextSeo } from "next-seo";
import prisma from "../../../../lib/prisma";

import { MealTabs } from "../../../../components/Tabs";
import { FAQ } from "../../../../components/FAQ";
import { AsideTopRestaurants } from "../../../../components/AsideTopRestaurants";

import { SectionIntro } from "../../../../components/SectionIntro";

import { SectionAllergens } from "../../../../components/SectionAllergens";
import { SectionChooseMilk } from "../../../../components/SectionChooseMilk";
import { SectionDisclaimer } from "../../../../components/SectionDisclaimer";
import { SectionIngredients } from "../../../../components/SectionIngredients";
import { SectionNutritionSummary } from "../../../../components/SectionNutritionSummary";
import { SectionRestaurantInfo } from "../../../../components/SectionRestaurantInfo";
import { SectionVariantsList } from "../../../../components/SectionVariantsList";

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
      restaurant: {
        include: {
          segment: true,
          restaurantTypes: true
        }
      },
      category: true,
      variants: {
        include: {
          subvariants: true
        }
      }
    },
  });

  const variant = await prisma.variant.findUnique({
    where: {
        mealVariantCombinedSlug: context.resolvedUrl.split("/")[1] + "-" + context.resolvedUrl.split("/")[2] + "-" + context.resolvedUrl.split("/")[3]
    }
    })

  const subvariant = await prisma.subvariant.findUnique({
    where: {
        fullSlug: context.resolvedUrl.split("/")[1] + "-" + context.resolvedUrl.split("/")[2] + "-" + context.resolvedUrl.split("/")[3] + "-" +context.resolvedUrl.split("/")[4]
    },
  })

  const category = mealData.category.name;

  // const mealsInCategory = await prisma.meal.findMany({
  //   where: {
  //     category: {
  //       name: category,
  //     },
  //   },
  // });

  const topRestaurants = await prisma.restaurant.findMany({
    where: {
      rank: {
        lt: 13,
      },
    },
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
      mealData: JSON.parse(JSON.stringify(mealData)),
      // mealsInCategory: JSON.parse(JSON.stringify(mealsInCategory)),
      topRestaurants: JSON.parse(JSON.stringify(topRestaurants)),
      variant: JSON.parse(JSON.stringify(variant)),
      subvariant: JSON.parse(JSON.stringify(subvariant)),
    },
  };
};

export default function Meal(props) {
  const { mealData, topRestaurants, subvariant, variant } = props;

  let restaurant = mealData.restaurant;
  let meal = {
    ...subvariant, 
    name: mealData.name, 
    slug: mealData.slug,
    variants: [], 
    subvariants: [],
    category: mealData.category }


  let proteinCalories = meal.protein*4
  let carbCalories = meal.totalCarbohydrates*9
  let fatCalories = meal.totalFat*4
  let totalCalories = proteinCalories + carbCalories + fatCalories
  let proteinPercent = ((proteinCalories / totalCalories)*100).toFixed(0)
  let carbPercent = ((carbCalories / totalCalories)*100).toFixed(0)
  let fatPercent = ((fatCalories / totalCalories)*100).toFixed(0)




  let macros = { 
    proteinCalories: meal.protein*4, 
    carbohydratesCalories: meal.totalCarbohydrates*9,
    fatCalories: meal.totalFat*4,
    totalCalories: meal.protein*4 + meal.totalCarbohydrates*10 + meal.totalFat*4

  } 


  const faqs = [
    {
      question: `How many calories are in the ${restaurant.name} ${meal.name}?`,
      answer: `There are ${meal.calories} calories in the ${meal.name}`,
    },
    {
      question: `What are the macros for the ${restaurant.name} ${meal.name}?`,
      answer: `The ${meal.name} has ${meal.protein}g protein, ${meal.totalCarbohydrates}g carbs and ${meal.totalFat}g fat. That means ${proteinPercent}% of calories come from protein, ${carbPercent}% of calories come from carbs, and ${fatPercent}% of calories come from fat.`,
    },
    // {
    //   question: `Is the ${meal.name} healthy?`,
    //   answer: `The ${meal.name} has ${meal.protein}g protein, ${meal.totalCarbohydrates}g carbs and ${meal.totalFat}g fat. That means ${proteinPercent}% of calories come from protein, ${carbPercent}% of calories come from carbs, and ${fatPercent}% of calories come from fat.`,
    // },
    // {
    //   question: `Which ${restaurant.name} menu item has the most calories?`,
    //   answer: ``
    // },
    // {
    //   question: `What is the healthiest item at ${restaurant.name}?`,
    //   answer: ``
    // },
    // {
    //   question: `How many calories should I eat a day to lose weight?`,
    //   answer: ``
    // },
  ]

  const pages = [
    { name: "All Restaurants", href: `/restaurants` },
    { name: restaurant.name, href: `/${restaurant.slug}` },
    { name: meal.name, href: `/${restaurant.slug}/${meal.slug}` },
    { name: variant.variantName, href: `/${restaurant.slug}/${meal.slug}/${variant.variantSlug}` },
    { name: subvariant.subvariantName, href: `/${restaurant.slug}/${meal.slug}/${variant.variantSlug}/${subvariant.subvariantSlug}` },

  ];


  const data = {
    labels: ["Carbohydrates", "Protein", "Fat"],
    datasets: [
      {
        label: "Macro Breakdown",
        data: [meal.totalCarbohydrates*4, meal.protein*4, meal.totalFat*9],
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
        title={`${meal.name}: Nutrition Facts and Calories | ${restaurant.name}`}
        description={`${restaurant.name} ${meal.name} Nutrition facts, calories, protein, fat and carbs. Discover nutrition facts, macros, and the healthiest items.`}
        canonical={`https://healthyfastfood.org/${restaurant.slug}/${meal.slug}/${variant.variantSlug}/${subvariant.subvariantSlug}`}
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
          <aside className="hidden lg:block shrink-0 pb-10 w-56 mr-8">
            <AsideTopRestaurants restaurants={topRestaurants} />
          </aside>
          <main className="overflow-x-auto">
          <SectionIntro meal={meal} restaurantName={restaurant.name} restaurantSlug={restaurant.slug} pages={pages}/>
            <MealTabs activeTab="" slug={`/${restaurant.slug}/${meal.slug}/${variant.variantSlug}/${subvariant.subvariantSlug}`} />
            <SectionNutritionSummary meal={meal} />

            <SectionAllergens meal={meal} />
            <SectionIngredients meal={meal} />
            <SectionRestaurantInfo restaurant={restaurant} />
            <FAQ faqs={faqs} />
            <SectionDisclaimer restaurantName={restaurant.name} />
          </main>
        </div>
      </Layout>
    </div>
  )
}


