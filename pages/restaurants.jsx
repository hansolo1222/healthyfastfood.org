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
// import * as restaurants from '../public/restaurant_links.json' assert {type: "json"};
import { useRouter } from "next/router";
import { Breadcrumbs } from "../components/Breadcrumbs";
import prisma from "../lib/prisma"

export const getServerSideProps = async (context) => {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: [
      {
        rank: "asc",
      },
    ],
    include: {
      segment: true,
      restaurantType: true
    }
  });

  
  return {
    props: {
      restaurants: JSON.parse(JSON.stringify(restaurants)),
    },
  };
};
export default function Restaurants(props) {
  const { restaurants } = props;


  let {
    items,
    requestSort,
    requestSortPreserveDirection,
    sortConfig,
    SortableTableHeader,
    SortableTableHeaderInverse,
    SortableTableHeaderROI,
  } = useSortableData(restaurants);

console.log(restaurants)

  return (
    <div className="">
      <Head>
        <title>All Restaurants | Healthy Fast Food</title>
        <meta name="description" content="" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Layout>
        <div className="">
        
          <h2 className="text-3xl font-bold text-center mb-8 mt-8">
         Most Popular Restaurants
        </h2>
            <table className="min-w-full divide-y divide-stone-300 rounded-lg">
              <thead className=" rounded-t-lg">
                <tr>
                
                  <td
                    scope="col"
                className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-left"
                  >
                  <SortableTableHeader colKey="name" name="Name" />
                  </td>
                  <td
                    scope="col"
                    className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-right"
                  >
                    <SortableTableHeader colKey="rank" name="Business Size Rank" />
                  </td>
                  {/* <td
                    scope="col"
                    className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-center"
                  >
                    <SortableTableHeader colKey="usVolume" name="Brand Popularity" />
                  </td> */}
                  <td
                    scope="col"
                    className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-center"
                  >
                    <SortableTableHeader colKey="locations" name="Number of Locations" />
                  </td>
                  {/* <td
                    scope="col"
                    className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-center"
                  >
                    <SortableTableHeader colKey="globalVolume" name="World Popularity" />
                  </td> */}
                  <td
                    scope="col"
                    className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-center"
                  >
                    <SortableTableHeader colKey="restaurantTypeSlug" name="Food Type" />
                  </td>
                  <td
                    scope="col"
                    className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-center"
                  >
                    <SortableTableHeader colKey="segmentSlug" name="Service Type" />
                  </td>
                 
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {items.map((restaurant, i) => {
                  console.log(restaurant)
                  return(
                  <tr className="hover:bg-stone-100" key={restaurant.key}>
                 
                    <td className="whitespace-nowrap py-1 text-md text-stone-900 text-left">
                    <div className="flex items-center">
                    <a href={`/${restaurant.slug}`} className="flex items-center">
                        <div className="relative w-10 h-10">
                            <Image
                              className=" flex-shrink-0 rounded-md mr-2"
                              src={`/images/logosSmall/${restaurant.slug}.webp`}
                              alt={`${restaurant.name} Logo`}
                              layout="fill"
                              objectFit="contain"
                            />
                          </div>

                          </a>

                      <a
                        href={`/${restaurant.slug}`}
                        className="cursor-pointer block  pl-4 -ml-px text-lg text-slate-600 hover:text-slate-900 "
                      >
                        {restaurant.name}
                      </a>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
                    {restaurant.rank}</td>
                    
                    {/* <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
                    {restaurant.usVolume}</td> */}
                    <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
                    {restaurant.locations}</td>
                    {/* <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
                    {restaurant.globalVolume}</td> */}
                    <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
                    {restaurant.restaurantType ? restaurant.restaurantType.name : ""}
                    </td>
                    <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
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
