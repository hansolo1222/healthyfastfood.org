import Head from "next/head";
import Image from "next/image";
//import styles from '../styles/Home.module.css'
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import NutritionFacts from "../../components/NutritionFacts";
import { useState } from "react";

export const getServerSideProps = async (context) => {

  const restaurant_slug = context.resolvedUrl.split("/")[1]

  const slug = context.params?.slug

  const data = require("/public/data/" + restaurant_slug + ".json");

  const meal = data.find((d)=>(d.slug == slug))

  if (meal == undefined){
    return {
      notFound: true,
    };
  }
  return {
    props: { 
      meal: meal
    }
  }
}

export default function Meal(props) {

  const {meal} = props

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
      <h1 className="text-3xl font-medium mt-4"></h1>

      <div className="max-w-md">
       <NutritionFacts data={meal}/>
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
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        🎁 Limited Edition
      </span>
    );
  }
};

const MealRow = ({ meal }) => {
  return (
    <tr className="minerDataRow">
      <td className="whitespace-nowrap px-3 py-1.5 text-md text-gray-900">
        <div className="flex items-center">
          <Image
            className=" flex-shrink-0 rounded-full mr-2"
            src={`/images/restaurant_logos/${meal.restaurant_slug}.svg`}
            alt={`${meal.restaurant_name} Logo`}
            width="24"
            height="24"
          />
          <div className="ml-2">
            <span className="text-gray-500">{meal.restaurant_name}</span>{" "}
            <span className="font-medium">{meal.meal_name}</span>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-gray-900 text-center">
        {categoryTag(meal.category)}
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-gray-900 text-center">
        {meal.calories} <span className="text-gray-500 text-sm">cal</span>
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-gray-900 text-center">
        {meal.protein} <span className="text-gray-500 text-sm">g</span>
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-gray-900 text-center">
        {meal.total_carbohydrates}{" "}
        <span className="text-gray-500 text-sm">g</span>
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-gray-900 text-center">
        {meal.total_fat} <span className="text-gray-500 text-sm">g</span>
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-gray-900 text-center">
        {meal.cholesterol} <span className="text-gray-500 text-sm">mg</span>
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-gray-900 text-center">
        {meal.sodium} <span className="text-gray-500 text-sm">mg</span>
      </td>
      <td className="whitespace-nowrap px-3 py-1 text-md text-gray-900 text-center">
        {meal.sugar} <span className="text-gray-500 text-sm">g</span>
      </td>
    </tr>
  );
};
