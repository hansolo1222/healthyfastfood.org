import Head from "next/head";
import Image from "next/image";
import Layout from "../../components/Layout";
import { useSortableData } from "../../components/UseSortableData";
import prisma from "../../lib/prisma";
import { ShareIcons } from "../../components/ShareIcons";
import { useEffect } from "react";

export const getServerSideProps = async (context) => {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: [
      {
        rank: "desc",
      },
    ],
    include: {
      segment: true,
      restaurantTypes: true,
      _count: {
        select: { meals: true },
      },
    },
  });

  const restaurantTypes = await prisma.restaurantType.findMany();

  return {
    props: {
      restaurants: JSON.parse(
        JSON.stringify(
          restaurants.map((r) => ({ ...r, itemCount: r._count.meals }))
        )
      ),
      restaurantTypes: JSON.parse(JSON.stringify(restaurantTypes)),
    },
  };
};



export default function Restaurants(props) {
  const { restaurants, restaurantTypes } = props;

  const formattedRestaurants = restaurants.map((r)=>({...r,restaurantTypesNames:r.restaurantTypes.map((type)=>type.name)}))


  // console.log(restaurantTypes.map((e)=>({"name":e.name})))
  let {
    items,
    requestSort,
    requestSortPreserveDirection,
    sortConfig,
    SortableTableHeader,
    SortableTableHeaderInverse,
    SortableTableHeaderROI,
  } = useSortableData(formattedRestaurants, {
    key: "rank",
    direction: "ascending",
  });



  return (
    <div className="">
      <Head>
        <title>All Restaurants | Healthy Fast Food</title>
        <meta name="description" content="" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Layout>
        <div className="mobile-padding">
        <div className="mb-8">
         {/* <!-- Ezoic - under_page_title - under_page_title --> */}    
         {/* <div id="ezoic-pub-ad-placeholder-106"> </div> */}
              {/* <!-- End Ezoic - under_page_title - under_page_title --> */}
          <h1 className="text-xl md:text-3xl font-bold text-center mb-4 mt-8">
            Most Popular Restaurants by Category
          </h1>
          <div className=""><ShareIcons size={28}  align="center"/></div>
          </div>

          {/* <p className="max-w-3xl">These are the most popular </p> */}
          <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-8">
            {restaurantTypes.map((type) => {
              return (
                <div className="col-span-1 border rounded-lg shadow-md" key={type.name}>
                <div className=" mx-4 pb-4 mt-4 border-b h-auto md:h-40">
                  <div className="flex items-center justify-between  mb-4">
                    <h2 className="text-lg font-semibold">
                    {type.name} Restaurants
                    </h2>
                    <a href={`/restaurants/${type.slug}`}
                    className="text-red-500 border border-red-500 font-semibold px-2 py-1 text-sm rounded cursor-pointer">
                      View All
                    </a>
                  </div>
                  <p className="text-stone-500 text-sm">
                  {type.description}                 
                  </p>
                  </div>
                  <table className=" divide-y divide-stone-300 rounded-lg w-full table-fixed">
                    <thead className=" rounded-t-lg">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-left"
                          style={{width:'80%'}}
                        >
                          <SortableTableHeader
                            colKey="name"
                            name="Name"
                            direction="ascending"
                          />
                        </th>
                

                        <th
                          scope="col"
                          className="pr-3 py-2.5 text-sm font-semibold  whitespace-nowrap text-greeny-600 text-right"
                          
                        >
                          <SortableTableHeader
                            colKey="locations"
                            name="#"
                            direction="descending"
                          />
                        </th>
                        
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {items
                        .filter((r) => r.restaurantTypesNames.includes(type.name))
                        .slice(0, 5)
                        .map((restaurant, i) => {
                          return (
                            <tr
                              className="hover:bg-stone-100"
                              key={restaurant.key}
                            >
                              <td className=" py-2 pl-4  text-md text-stone-900 text-left">
                                <div className="flex items-center">
                                  <a
                                    href={`/${restaurant.slug}`}
                                    className="flex items-center"
                                  >
                                    <div className="relative w-7 h-7">
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
                                    className="cursor-pointer block  pl-2 -ml-px hover:text-red-500 "
                                  >
                                    {restaurant.name}
                                  </a>
                                  {restaurant._count.meals !== 0 ? 
                                  ""
                                 : (
                                  
                                  <span className="text-xs border text-stone-500 ml-2 px-2 py-0.5 rounded-full">
                                    No Data
                                  </span>
                                 )
                                  }
                                </div>
                              </td>
                              {/* <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
                    {restaurant.rank}</td> */}

                              <td className="whitespace-nowrap py-1 text-md text-stone-900 text-right pr-4">
                                {restaurant.locations}
                              </td>
                              {/* <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
                                {restaurant._count.meals !== 0 ? (
                                  restaurant._count.meals
                                ) : (
                                  <span className="text-xs border text-stone-500 px-2 py-1 rounded-full">
                                    No data yet
                                  </span>
                                )}
                              </td> */}

                              {/* <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
                    {restaurant.restaurantType ? restaurant.restaurantType.name : ""}
                    </td> */}
                              {/* <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
                                {restaurant.segment
                                  ? restaurant.segment.name
                                  : ""}
                              </td> */}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          {/* 
            <table className="max-w-3xl mx-auto divide-y divide-stone-300 rounded-lg ">
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
                    className="px-3 py-0.5 text-sm whitespace-nowrap font-semibold text-greeny-600 text-right"
                  >
                    <SortableTableHeader colKey="rank" name="Rank" direction="ascending"/>
                  </td>
                 
                  <td
                    scope="col"
                    className="px-3 py-2.5 text-sm font-semibold  whitespace-nowrap text-greeny-600 text-center"
                  >
                    <SortableTableHeader colKey="locations" name="# Locations" direction="descending"/>
                  </td>
                  <td
                    scope="col"
                    className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-center"
                  >
                    <SortableTableHeader colKey="itemCount" name="Items" />
                  </td>
                  <td
                    scope="col"
                    className="px-3 py-2.5 text-sm font-semibold  whitespace-nowrap text-greeny-600 text-center"
                  >
                    <SortableTableHeader colKey="restaurantTypeSlug" name="Food Type" direction="ascending"/>
                  </td>
                  <td
                    scope="col"
                    className="px-3 py-0.5 text-sm font-semibold  whitespace-nowrap  text-greeny-600 text-center"
                  >
                    <SortableTableHeader colKey="segmentSlug" name="Service Type" direction="ascending"/>
                  </td>
                 
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {items.filter((r)=>r.restaurantTypeSlug == 'Hamburgers').map((restaurant, i) => {
                  return(
                  <tr className="hover:bg-stone-100" key={restaurant.key}>
                 
                    <td className="whitespace-nowrap py-2 px-2 text-md text-stone-900 text-left">
                    <div className="flex items-center">
                    <a href={`/${restaurant.slug}`} className="flex items-center">
                        <div className="relative w-8 h-8">
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
                        className="cursor-pointer block  pl-2 -ml-px hover:text-red-500 "
                      >
                        {restaurant.name}
                      </a>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
                    {restaurant.rank}</td>
                    
                 
                    <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
                    {restaurant.locations}</td>
                    <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
                    {restaurant._count.meals !== 0 
                    ? restaurant._count.meals 
                    : <span className="text-xs border text-stone-500 px-2 py-1 rounded-full">No data yet</span>}</td>
                   
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
            </table> */}
        </div>
      </Layout>
    </div>
  );
}
