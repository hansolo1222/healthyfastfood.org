import Head from "next/head";
import Image from "next/image";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { useSortableData } from "../../components/UseSortableData";
import Link from "next/link";
import { useRouter } from "next/router";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import prisma from "../../lib/prisma";
import { NextSeo } from "next-seo";
import { FoodCategoryTabs } from "../../components/Tabs";
import { classNames, getCustomNutritionRowInfo, getUmbrellaCategory } from "../../components/utils";
import { AsideFilterByCalories } from "../../components/AsideFilterByCalories";
import { AsideFilterByUmbrellaCategories } from "../../components/AsideFilterByUmbrellaCategory";
import { AsideAllergens } from "../../components/AsideAllergens";
import { AsideTopRestaurants } from "../../components/AsideTopRestaurants";
import { FilterThematicFilter } from "../../components/FilterThematicFilter";
import { TableHeaders, TableMealRow } from "../../components/TableMealRow";
import Select from "react-select";
import { formatParentCategory } from "../../components/TableMealRow";
export const getServerSideProps = async (context) => {
  
  // const parent = await prisma.parentCategory.findUnique({
  //   where: {
  //     slug: String(context.params?.categorySlug)
  //   },
  //   include: {
  //     categories: {
  //       include: {
  //         meals: {
  //           include: {
  //             restaurant: true,
  //             category: {
  //               include: {
  //                 parentCategory: true
  //               }
  //             },
  //             variants: {
  //               include: {
  //                 subvariants: true
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  const parentCategories = await prisma.parentCategory.findMany()

  const restaurants = await prisma.restaurant.findMany({
    orderBy: [
      {
        rank: "asc",
      },
    ],
  });

  return {
    props: {
      // parent: JSON.parse(JSON.stringify(parent)),
      parentCategories: JSON.parse(JSON.stringify(parentCategories)),
      restaurants: JSON.parse(JSON.stringify(restaurants)),
    },
  };
};


export default function Category(props) {
  const router = useRouter();

  let {parentCategories, restaurants} = props;

  return (
    <div className="">
      <NextSeo
        title={`Nutrition Facts and Calories | Healthy Fast Food`}
        description={`All Food Categories`}
        canonical={`https://healthyfastfood.org/category/`}
        additionalMetaTags={[
          {
            property: "keywords",
            content: `,nutrition,facts,`,
          },
        ]}
        openGraph={{
          url: "https://healthyfastfood.org/category",
          type: "website",
          title:
            "Categories | Healthy Fast Food",
          description:
            "Discover nutrition facts, macros, and the healthiest items in every food category",
          images: [
            {
              url: `/images/restaurant_logos/mcdonalds.webp`,
              width: 400,
              height: 400,
              alt: " Logo",
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
        <title>Food Categories | Healthy Fast Food</title>
        <meta name="description" content="" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Layout>
      <div className=" mt-10 mb-10">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4">
              Restaurant Meals by Category
            </h1>
            </div>
        <div className="flex">
        

        <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      {parentCategories.filter((c)=>(c.name!== "Uncategorized")).map((category) => (
        <li key={category.slug} className="relative">
          <a href={`/category/${category.slug}`}>
          <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
            <div className="h-28 md:h-40">
            <img src={`/images/categoriesLarge/${category.slug}.jpg`} alt="" className="object-cover pointer-events-none group-hover:opacity-75" />
            </div>
            <button type="button" className="absolute inset-0 focus:outline-none">
              <span className="sr-only">{category.name}</span>
            </button>
          </div>
          </a>
          <p className="mt-2 block text-lg font-medium text-gray-900 truncate pointer-events-none">{category.name}</p>
          {/* <p className="block text-sm font-medium text-gray-500 pointer-events-none">{file.size}</p> */}
        </li>
      ))}
    </ul>


          {/* <aside className="hidden lg:block shrink-0 pb-10 w-100 pr-8 mx-auto">

          <div className="mt-8 rounded-xl p-2">
              <h2 className="text-stone-500 text-xs uppercase font-semibold p-2 ">
                Food Categories
              </h2>
              {parentCategories.filter((c)=>c.slug!=="uncategorized").map((category) => (
                <div
                  className="hover:bg-stone-200 rounded-xl"
                  key={category.slug}
                >
                  <a
                    href={`/category/${category.slug}`}
                    className="cursor-pointer w-full flex items-center p-2"
                    key={category.slug}
                  >
                    <div className="relative w-6 h-6">
                      
                      {formatParentCategory(category.slug, false, true, false)}
                    </div>
                    <div className="pl-2 text-stone-500 text-sm">
                      {category.name}
                    </div>
                  </a>
                </div>
              ))}
            </div>
            
          </aside> */}
         
        </div>
      </Layout>
    </div>
  );
}





