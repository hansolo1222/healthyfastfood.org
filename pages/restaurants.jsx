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
import * as restaurants from '../public/restaurant_links.json' assert {type: "json"};
import { useRouter } from "next/router";
import { Breadcrumbs } from "../components/Breadcrumbs";


export default function Restaurants(props) {

  return (
    <div className="">
      <Head>
        <title>All Restaurants | Healthy Fast Food</title>
        <meta
          name="description"
          content=""
        />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex">
          <div className="hidden lg:inline z-20 inset-0
           pb-10 overflow-y-auto">
            <nav className="lg:text-sm lg:leading-6 w-full">
              <div className="mt-8">
                <h4 className="mb-8 lg:mb-3 font-semibold text-slate-900 dark:text-slate-200">All Restaurants</h4>
              <div className="grid grid-cols-8">
               {restaurants.default.map((e)=>(
                <div className="col-span-1 border">
                  <a href={`/${e.slug}`} className="cursor-pointer block  pl-4 -ml-px   text-slate-600 hover:text-slate-900 ">
                  {e.restaurant_name}
                  </a>
                </div>
                ))} 
                </div>
              </div>
            </nav>
           </div>
          
        </div>
      </Layout>
    </div>
  );
}
