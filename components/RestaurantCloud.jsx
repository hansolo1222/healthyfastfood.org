import React from 'react';
import Link from 'next/link';
export default function RestaurantCloud({restaurants}) {
  return (
    <div className="bg-white">
    <h2 className="text-3xl font-bold text-center mb-4 mt-8">Most popular restaurants</h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-5" >
          {restaurants.map((restaurant)=>(
            <Link href={`/${restaurant.slug}`} key={restaurant.slug}>
            <div className="hover:bg-stone-100 rounded-xl py-4">
              <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1 cursor-pointer">
                <img className="h-16 w-auto" src={`/images/logos_large/${restaurant.slug}.webp`} alt={`${restaurant.name} Logo`} />
              </div>
              </div>
            </Link>
          ))}
{/*            
          <Link href="/starbucks" >
          <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1 cursor-pointer">
            <img className="h-20" src="/images/logos_large/starbucks.png" alt="Starbucks Logo" />
          </div>
          </Link>
          <Link href="/chick-fil-a" >
          <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1 cursor-pointer">
            <img className="h-16" src="/images/logos_large/chick-fil-a.svg" alt="Chick-Fil-A" />
          </div>
          </Link>
          <Link href="/taco-bell" >
          <div className="col-span-1 flex items-center justify-center md:col-span-3 lg:col-span-1 cursor-pointer">
            <img
              className="h-20"
              src="/images/logos_large/taco-bell.svg"
              alt="Taco Bell"
            />
          </div>
          </Link>
          <Link href="/burger-king" >
          <div className="col-span-2 flex justify-center md:col-span-3 lg:col-span-1 cursor-pointer">
            <img
              className="h-16"
              src="/images/logos_large/burger-king.png"
              alt="Workcation"
            />
          </div>
          </Link>
          <Link href="/subway" >

          <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1 cursor-pointer">
            <img className="h-8" src="/images/logos_large/subway.png" alt="Subway" />
          </div>
          </Link>
          <Link href="/wendys" >
          <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1 cursor-pointer">
            <img className="h-16" src="/images/logos_large/wendys.png" alt="Wendy's" />
          </div>
          </Link>
          <Link href="/dunkin-donuts" >
          <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1 cursor-pointer">
            <img className="h-16" src="/images/logos_large/dunkin-donuts.png" alt="Dunkin' Donuts" />
          </div>
          </Link>
          <Link href="/dominos" >
          <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1 cursor-pointer">
            <img className="h-16" src="/images/logos_large/dominos.png" alt="Tuple" />
          </div>
          </Link>
          <Link href="/panera-bread" >
          <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1 cursor-pointer">
            <img className="h-16" src="/images/logos_large/panera-bread.png" alt="Tuple" />
          </div>
          </Link> */}
        </div>
      </div>
      <div className="flex justify-center">
      <a href="/restaurants" className="bg-red-500 hover:bg-red-700 text-white text-xl font-medium py-4 px-5 rounded mx-auto">
        See All Restaurants
      </a>
      </div>
    </div>
  )
}