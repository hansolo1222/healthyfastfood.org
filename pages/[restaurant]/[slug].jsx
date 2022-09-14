import Head from "next/head";
import Layout from "../../components/Layout";

import { NextSeo } from "next-seo";
import prisma from "../../lib/prisma";

import { MealTabs } from "../../components/Tabs";
import { FAQ } from "../../components/FAQ";
import { AsideTopRestaurants } from "../../components/AsideTopRestaurants";

import { SectionIntro } from "../../components/SectionIntro";

import { SectionAllergens } from "../../components/SectionAllergens";
import { SectionChooseMilk } from "../../components/SectionChooseMilk";
import { SectionDisclaimer } from "../../components/SectionDisclaimer";
import { SectionIngredients } from "../../components/SectionIngredients";
import { SectionNutritionSummary } from "../../components/SectionNutritionSummary";
import { SectionRestaurantInfo } from "../../components/SectionRestaurantInfo";
import { SectionVariantsList } from "../../components/SectionVariantsList";

import { ShareIcons } from "../../components/ShareIcons";
import { AsideRelatedMeals, AsideRelatedMealsOtherRestaurants } from "../../components/AsideRelatedMeals";

export const getServerSideProps = async (context) => {

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
          restaurantTypes: true,
        },
      },
      category: {
        include: {
          parentCategory: true,
        }
      },
      variants: {
        include: {
          subvariants: true,
        },
      },
    },
  });

  // get 10 meals in this restaurant in this category

  console.log(mealData)

  const restaurant = mealData.restaurant

  const relatedMeals = await prisma.meal.findMany({
    take: 10,
    where: {
      restaurant: {
        slug: mealData.restaurant.slug,
      },
      category: {
        name: mealData.category.name
      }
    }
  })

  const relatedMealsOtherRestaurants = await prisma.meal.findMany({
    take: 8,
    where: {
      category: {
        parentCategorySlug: mealData.category.parentCategorySlug
      }
    },
    include: {
      restaurant: true,
    }
  })

  // get 10 restaurants in this restaurantType
  
  const restaurantType = mealData.restaurant.restaurantTypes[0].slug;

  const type = await prisma.restaurantType.findUnique({
    
    where: {
      slug: restaurantType
    },
    include: {
      restaurants: true
    }
  })

  // const restaurants = await prisma.restaurant.findMany({
  //   take: 8,
  //   where: {
  //     restaurantType: {
  //       slug: restaurantType,
  //     },
  //   },
  //   orderBy: [
  //     {
  //       rank: "asc",
  //     },
  //   ],
  // });

  return {
    props: {
      meal: JSON.parse(JSON.stringify(mealData)),
      relatedMeals: JSON.parse(JSON.stringify(relatedMeals)),
      relatedMealsOtherRestaurants:  JSON.parse(JSON.stringify(relatedMealsOtherRestaurants)),
      // mealsInCategory: JSON.parse(JSON.stringify(mealsInCategory)),
      restaurantsInCategory: JSON.parse(JSON.stringify(type.restaurants)),
    },
  };
};

export default function Meal(props) {
  const { meal, relatedMeals, relatedMealsOtherRestaurants, restaurantsInCategory } = props;

  let restaurant = meal.restaurant;
  let parentCategory = meal.category.parentCategorySlug;

  let proteinCalories = meal.protein * 4;
  let carbCalories = meal.totalCarbohydrates * 9;
  let fatCalories = meal.totalFat * 4;
  let totalCalories = proteinCalories + carbCalories + fatCalories;
  let proteinPercent = ((proteinCalories / totalCalories) * 100).toFixed(0);
  let carbPercent = ((carbCalories / totalCalories) * 100).toFixed(0);
  let fatPercent = ((fatCalories / totalCalories) * 100).toFixed(0);

  let macros = {
    proteinCalories: meal.protein * 4,
    carbohydratesCalories: meal.totalCarbohydrates * 9,
    fatCalories: meal.totalFat * 4,
    totalCalories:
      meal.protein * 4 + meal.totalCarbohydrates * 10 + meal.totalFat * 4,
  };

  const addJsonLdNutrition = () => {
    return {
      __html: `
    {
      "@context": "http://schema.org",
            "@type":"MenuItem",
            "name":"${meal.name}",
            "nutrition": {
              "@type":"NutritionInformation",
              "calories":"${meal.calories}",
              "fatContent":"${meal.totalFat}",
              "saturatedFatContent":"${meal.saturatedFat}",
              "transFatContent":"${meal.transFat}",
              "proteinContent":"${meal.protein}",
              "carbohydrateContent":"${meal.totalCarbohydrates}",
              "sodiumContent":"${meal.sodium}",
              "sugarContent":"${meal.sugar}",
              "fiberContent":"${meal.dietaryFiber}"


            
            }
          }
            

    `,
    };
  };
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
  ];

  const pages = [
    { name: "All Restaurants", href: `/restaurants` },
    { name: restaurant.name, href: `/${restaurant.slug}` },
    { name: meal.name, href: `/${restaurant.slug}/${meal.slug}` },
  ];

  return (
    <div className="">
      <NextSeo
        title={`${meal.name}: Nutrition Facts and Calories | ${restaurant.name}`}
        description={`${restaurant.name} ${meal.name} Nutrition facts, calories, protein, fat and carbs. Discover nutrition facts, macros, and the healthiest items.`}
        canonical={`https://healthyfastfood.org/${restaurant.slug}/${meal.slug}`}
        additionalMetaTags={[
          {
            property: "keywords",
            content: `${restaurant.name},${meal.name},healthy, fast food,nutrition facts,calories,protein,fat,carbohydrates,dietary fiber,sugars,vitamin a,vitmain c, iron, calcium,healthy choices`,
          },
        ]}
        openGraph={{
          url:
            "https://healthyfastfood.org/" + restaurant.slug + "/" + meal.slug,
          type: "website",
          title:
            restaurant.name +
            " " +
            meal.name +
            " Nutrition Facts and Calories | Healthy Fast Food",
          description:
            "How many calories are in the " +
            restaurant.name +
            " " +
            meal.name +
            "? Is it healthy?",
          images: [
            {
              url: `/images/restaurant_logos/${meal.slug}.webp`,
              width: 400,
              height: 400,
              alt: meal.name + " Logo",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={addJsonLdNutrition()}
        />
      </Head>
      <Layout>
        <div className="flex mobile-padding">
          <aside className="hidden lg:block shrink-0 pb-10 w-56 mr-8">
            <AsideRelatedMeals meals={relatedMeals} restaurant={restaurant} parentCategory={parentCategory}/>
            <AsideRelatedMealsOtherRestaurants meals={relatedMealsOtherRestaurants} />
            <AsideTopRestaurants restaurants={restaurantsInCategory} />
          </aside>
          <main className="overflow-x-auto">
            <SectionIntro meal={meal} restaurantName={restaurant.name} restaurantSlug={restaurant.slug} pages={pages}/>
           
            {meal.variants.length > 0 ? (
              meal.variants[0].subvariants.length > 0 ? (
                <SectionChooseMilk meal={meal} restaurant={restaurant}/> 
                /* if there are subvariants */
              ) : (
                <SectionVariantsList meal={meal} restaurant={restaurant} />
                 /* if there are variants */
              )
            ) : (
              <>
              <MealTabs activeTab="" slug={`/${restaurant.slug}/${meal.slug}`} />
              <SectionNutritionSummary meal={meal} />
              <SectionAllergens meal={meal} />
              <SectionIngredients meal={meal} />
              <SectionRestaurantInfo restaurant={restaurant} />
              <FAQ faqs={faqs} />
              <SectionDisclaimer restaurantName={restaurant.name} />
              </>
               /* regular */
            )}

           
          </main>
        </div>
        <div className="block sm:flex md:hidden mobile-padding ">
          <AsideRelatedMeals meals={relatedMeals} restaurant={restaurant} parentCategory={parentCategory}/>
            <AsideRelatedMealsOtherRestaurants meals={relatedMealsOtherRestaurants} />
            <AsideTopRestaurants restaurants={restaurantsInCategory} />
        </div>
      </Layout>
    </div>
  );
}
