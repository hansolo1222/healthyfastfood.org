import Head from "next/head";
import Image from "next/image";
//import styles from '../styles/Home.module.css'
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import { useState } from "react";
import { useSortableData } from "../../components/UseSortableData";
import { useFilteredData } from "../../components/UseFilteredData";
//let glob = require( 'glob' ), path = require( 'path' );
//import recursiveReaddirFiles from 'recursive-readdir-files';
import Link from "next/link";
import { MealRow } from ".";
// import * as restaurants from '../public/restaurant_links.json' assert {type: "json"};
import { useRouter } from "next/router";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import prisma from "../../lib/prisma";

export const getServerSideProps = async (context) => {
  // const restaurants = await prisma.restaurant.findMany({
  //   where: {
  //     restaurantType: {
  //       slug: String(context.params?.restaurantTypeSlug),
  //     }
  //   },
  //   orderBy: [
  //     {
  //       rank: "desc",
  //     },
  //   ],
  //   include: {
  //     segment: true,
  //     _count: {
  //       select: { meals: true },
  //     },
  //   },
  // });

  const type = await prisma.restaurantType.findUnique({
    where: {
      slug: String(context.params?.restaurantTypeSlug),
    },
    include: {
      restaurants: true
    }
  })

  const restaurantTypes = await prisma.restaurantType.findMany();

  return {
    props: {
      // restaurants: JSON.parse(
      //   JSON.stringify(
      //     restaurants.map((r) => ({ ...r, itemCount: r._count.meals }))
      //   )
      // ),
      restaurantTypes: JSON.parse(JSON.stringify(restaurantTypes)),
      type: JSON.parse(JSON.stringify(type)),
    },
  };
};
export default function Restaurants(props) {
  const { restaurants, restaurantTypes, type } = props;

  console.log(type)

  console.log(restaurants, "here");

  let {
    items,
    requestSort,
    requestSortPreserveDirection,
    sortConfig,
    SortableTableHeader,
    SortableTableHeaderInverse,
    SortableTableHeaderROI,
  } = useSortableData(type.restaurants, {
    key: "rank",
    direction: "ascending",
  });

  return (
    <div className="">
      <Head>
        <title> | Healthy Fast Food</title>
        <meta name="description" content="" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Layout>
        <div className="">
          <div className=" mt-8 mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4">
              Most Popular {type.name} Restaurants 
            </h1>
            <p className="max-w-2xl text-sm text-center mx-auto text-stone-500">{type.description} </p>
          </div>

          
            <table className="max-w-3xl mx-auto divide-y divide-stone-300 rounded-lg">
              <thead className=" rounded-t-lg">
                <tr>
                
                  <td
                    scope="col"
                className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-left"
                  >
                  <SortableTableHeader colKey="name" name="Name" direction="ascending"/>
                  </td>
 
                 
                  <td
                    scope="col"
                    className="px-3 py-2.5 text-sm font-semibold  whitespace-nowrap text-greeny-600 text-center"
                  >
                    <SortableTableHeader colKey="locations" name="# Locations" direction="descending"/>
                  </td>
                  <td
                    scope="col"
                    className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-center hidden md:table-cell"
                  >
                    <SortableTableHeader colKey="itemCount" name="Items" />
                  </td>
                  
                  <td
                    scope="col"
                    className="px-3 py-0.5 text-sm font-semibold  whitespace-nowrap  text-greeny-600 text-center hidden sm:table-cell"
                  >
                    <SortableTableHeader colKey="segmentSlug" name="Service Type" direction="ascending"/>
                  </td>
                 
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {items.map((restaurant, i) => {
                  return(
                  <tr className="hover:bg-stone-100" key={restaurant.key}>
                 
                    <td className="whitespace-nowrap py-2 px-2 text-md text-stone-900 text-left">
                    <div className="flex items-center">
                    <a href={`/${restaurant.slug}`} className="flex items-center">
                        <div className="relative w-10 h-10">
                            <Image
                              className=" flex-shrink-0 rounded-md mr-4"
                              src={`/images/logosSmall/${restaurant.slug}.webp`}
                              alt={`${restaurant.name} Logo`}
                              layout="fill"
                              objectFit="contain"
                            />
                          </div>

                          </a>

                      <a
                        href={`/${restaurant.slug}`}
                        className="cursor-pointer block  pl-2 -ml-px hover:text-red-500 "
                      >
                        {restaurant.name}
                      </a>
                      </div>
                    </td>
             
                 
                    <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
                    {restaurant.locations}</td>
                    {/* <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center hidden md:table-cell">
                    {restaurant._count.meals !== 0 
                    ? restaurant._count.meals 
                    : <span className="text-xs border text-stone-500 px-2 py-1 rounded-full">No data yet</span>}</td>
                 */}
                    <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center hidden sm:table-cell">
                    {restaurant.segment ? restaurant.segment.name : ""}
                    </td>
                    
                  </tr>
                  )
                }
                )}
              </tbody>
            </table>
        </div>
      </Layout>
    </div>
  );
}
