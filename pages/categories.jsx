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
  const categories = await prisma.parentCategory.findMany({
    orderBy: [
      {
        name: "asc",
      },
    ],
  });

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
};
export default function Restaurants(props) {
  const { categories } = props;


  let {
    items,
    requestSort,
    requestSortPreserveDirection,
    sortConfig,
    SortableTableHeader,
    SortableTableHeaderInverse,
    SortableTableHeaderROI,
  } = useSortableData(categories);


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
         Food Categories
        </h2>
            <table className="min-w-full divide-y divide-stone-300 rounded-lg">
              <thead className="bg-stone-50 rounded-t-lg">
                <tr>
                  <td
                    scope="col"
                className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-left"
                  >
                  <SortableTableHeader colKey="name" name="Name" />
                  </td>
                  <td
                    scope="col"
                className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-left"
                  >
                <SortableTableHeader colKey="rank" name="Size Rank" />

                  </td>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {items.map((restaurant) => (
                  <tr className="hover:bg-stone-100" key={restaurant.key}>
                 
                    <td className="whitespace-nowrap py-1 text-base text-stone-900 text-left">
                    <div className="flex items-center">
                    <a href={`category/${restaurant.slug}`} className="flex items-center">
                        <div className="relative w-10 h-10">
                            <Image
                              className=" flex-shrink-0 rounded-md mr-2"
                              src={`/images/categories/${restaurant.slug}.webp`}
                              alt={`${restaurant.name} Logo`}
                              layout="fill"
                              objectFit="contain"
                            />
                          </div>

                          </a>

                      <a
                        href={`category/${restaurant.slug}`}
                        className="cursor-pointer block  pl-4 -ml-px text-lg text-slate-600 hover:text-slate-900 "
                      >
                        {restaurant.name}
                      </a>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-1 text-base text-stone-900 text-center">
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </Layout>
    </div>
  );
}
