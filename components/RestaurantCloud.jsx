import React from 'react';

export default function RestaurantCloud() {
  return (
    <div className="bg-white">
    <h2 className="text-3xl font-bold text-center mb-4 mt-8">Most popular restaurants</h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">

          <a href="/mcdonalds" className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1">
            <img className="h-16" src="/images/logos_large/mcdonalds.png" alt="Tuple" />
          </a>
          <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1">
            <img className="h-20" src="/images/logos_large/starbucks.png" alt="Mirage" />
          </div>
          <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1">
            <img className="h-16" src="/images/logos_large/chick-fil-a.svg" alt="StaticKit" />
          </div>
          <div className="col-span-1 flex items-center justify-center md:col-span-3 lg:col-span-1">
            <img
              className="h-20"
              src="/images/logos_large/taco-bell.svg"
              alt="Transistor"
            />
          </div>
          <div className="col-span-2 flex justify-center md:col-span-3 lg:col-span-1">
            <img
              className="h-16"
              src="/images/logos_large/burger-king.png"
              alt="Workcation"
            />
          </div>
          <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1">
            <img className="h-8" src="/images/logos_large/subway.png" alt="Tuple" />
          </div>
          <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1">
            <img className="h-16" src="/images/logos_large/wendys.png" alt="Tuple" />
          </div>
          <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1">
            <img className="h-16" src="/images/logos_large/dunkin-donuts.png" alt="Tuple" />
          </div>
          <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1">
            <img className="h-16" src="/images/logos_large/dominos.png" alt="Tuple" />
          </div>
          <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1">
            <img className="h-16" src="/images/logos_large/panera-bread.png" alt="Tuple" />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
      <button class="bg-red-500 hover:bg-red-700 text-white text-xl font-medium py-4 px-5 rounded mx-auto">
        See All Restaurants
      </button>
      </div>
    </div>
  )
}