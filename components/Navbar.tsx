"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
//import { signOut, useSession } from "next-auth/react";
import { useRef } from "react";

import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const menu = [
  { key: "High Protein Entrees", url: "/best/", name: "High Protein Entrees" },
  {
    key: "High Protein Burgers & Sandwiches",
    url: "/best/protein/burgers-sandwiches",
    name: "High Protein Burgers & Sandwiches",
  },
  { key: "High Protein Salads", url: "e", name: "High Protein Salads" },

  { key: "High Protein Steaks", url: "e", name: "High Protein Steaks" },

  { key: "High Protein Burritos", url: "e", name: "High Protein Burritos" },
  { key: "High Protein Tacos", url: "e", name: "High Protein Tacos" },
  { key: "High Protein Bowls", url: "e", name: "High Protein Bowls" },
];

const categoriesMenu = [
  {
    key: "Burgers & Sandwiches",
    url: "/category/burgers-sandwiches",
    name: "Burgers & Sandwiches",
  },
  { key: "Salads", url: "/category/salads", name: "Salads" },

  { key: "Steaks", url: "/category/steaks", name: "Steaks" },

  { key: "Burritos", url: "/category/burritos", name: "Burritos" },

  { key: "Tacos", url: "/category/tacos", name: "Tacos" },
  { key: "Pasta", url: "/category/pasta", name: "Pasta" },
  { key: "High Protein Bowls", url: "/category/bowls", name: "Bowls" },
];

const Navbar = () => {
  const router = useRouter();
  // const isActive = (pathname) => router.pathname === pathname;

  // const { data: session, status } = useSession();

  let right = null;

  const navigation = [
    {
      name: "Popular",
      href: "/restaurants",
      secondLevel: true,
      secondLevelData: [
        { name: "All Restaurants", href: "/restaurants" },
        { name: "---------", href: "" },
        { name: "McDonald's", href: "/mcdonalds" },
        { name: "Sandwich Restaurants", href: "/restaurants/sandwiches" },
        { name: "Coffee & Beverage", href: "/restaurants/beverages" },
        { name: "Chicken Restaurants", href: "/restaurants/chicken" },
        { name: "Pizza Places", href: "/restaurants/pizza" },
        { name: "Steakhouses", href: "/restaurants/steakhouse" },
        { name: "Barbeque Restaurants", href: "/restaurants/barbeque" },
        { name: "---------", href: "" },
        { name: "Asian Restaurants", href: "/restaurants/asian" },
        { name: "Italian Restaurants", href: "/restaurants/italian" },
        { name: "Mexican Restaurants", href: "/restaurants/mexican-tex-mex" },
        { name: "American Restaurants", href: "/restaurants/american" },
        { name: "---------", href: "" },
        { name: "Breakfast Places", href: "/restaurants/breakfast" },
        { name: "Baked Goods", href: "/restaurants/baked-goods" },
        {
          name: "Ice Cream & Frozen Desserts",
          href: "/restaurants/frozen-desserts",
        },
      ],
    },
    {
      name: "Restaurant Types",
      href: "/restaurants",
      secondLevel: true,
      secondLevelData: [
        { name: "All Restaurants", href: "/restaurants" },
        { name: "---------", href: "" },
        { name: "Hamburger Restaurants", href: "/restaurants/hamburgers" },
        { name: "Sandwich Restaurants", href: "/restaurants/sandwiches" },
        { name: "Coffee & Beverage", href: "/restaurants/beverages" },
        { name: "Chicken Restaurants", href: "/restaurants/chicken" },
        { name: "Pizza Places", href: "/restaurants/pizza" },
        { name: "Steakhouses", href: "/restaurants/steakhouse" },
        { name: "Barbeque Restaurants", href: "/restaurants/barbeque" },
        { name: "---------", href: "" },
        { name: "Asian Restaurants", href: "/restaurants/asian" },
        { name: "Italian Restaurants", href: "/restaurants/italian" },
        { name: "Mexican Restaurants", href: "/restaurants/mexican-tex-mex" },
        { name: "American Restaurants", href: "/restaurants/american" },
        { name: "---------", href: "" },
        { name: "Breakfast Places", href: "/restaurants/breakfast" },
        { name: "Baked Goods", href: "/restaurants/baked-goods" },
        {
          name: "Ice Cream & Frozen Desserts",
          href: "/restaurants/frozen-desserts",
        },
      ],
    },
    {
      name: "Meal Categories",
      href: "/category",
      secondLevel: true,
      secondLevelData: [
        { name: "All Meal Categories", href: "/category" },
        { name: "---------", href: "" },
        { name: "Burgers & Sandwiches", href: "/category/burgers-sandwiches" },
        { name: "Salads", href: "/category/salads" },
        { name: "Steaks", href: "/category/steaks" },
        { name: "Chicken", href: "/category/chicken" },
        { name: "Burritos", href: "/category/burritos" },
        { name: "Tacos", href: "/category/tacos" },
        { name: "Pasta", href: "/category/pastas" },
        { name: "Pizza", href: "/category/pizzas" },
        { name: "Soups", href: "/category/soups" },
        { name: "---------", href: "" },
        { name: "Ice Cream", href: "/category/ice-cream" },
        { name: "Shakes", href: "/category/shakes" },
        { name: "Pastries", href: "/category/pastries" },
        { name: "Donuts", href: "/category/donuts" },
        { name: "Coffee", href: "/category/coffee" },
      ],
    },
    {
      name: "About",
      href: "/about",
      secondLevel: true,
      secondLevelData: [],
    },
  ];

  return (
    <>
      <Disclosure as="nav" className=" border-b relative">
        {({ open }) => (
          <>
            <div className="max-w-8xl mx-auto px-3 sm:px-5 md:px-7 ">
              <div className="relative flex items-center justify-beeen h-12 md:h-16">
                <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex-shrink-0 flex items-center ">
                    <Link href="/" >
                      <img
                        className="block md:hidden h-8 w-auto"
                        src="/images/mark.svg"
                        alt="HealthyFastFood Mark"
                      />
                    </Link>
                    <Link href="/" >
                      <img
                        className="hidden md:block h-6 w-auto cursor-pointer mr-4"
                        src="/images/logo.svg"
                        alt="HealthyFastFood Logo"
                      />
                    </Link>
                  </div>
                  {/* <div className="hidden sm:block sm:ml-6"> */}
                  <div className="sm:flex space-x-4 items-center ml-6 hidden">
                    {navigation.map((item) => (
                      <div className="flex" key={item.name}>
                        <div className="relative">
                          <Link
                            href={item.href}
                            className={classNames(
                              "hover:text-pink-600 mr-4",
                              "py-1 rounded-md    font-medium text-sm",
                              item.secondLevel ? "peer" : ""
                            )}
                            aria-current={"page"}
                          >
                            {item.name}
                          </Link>
                          {item.secondLevel ? (
                            <div
                              className="hidden peer-hover:flex hover:flex border
                           w-[230px]
                           flex-col bg-white drop-shadow-md absolute z-50 rounded-lg py-2"
                            >
                              {item.secondLevelData.map((subItem, index) =>
                                subItem.name == "---------" ? (
                                  <span
                                    key={index}
                                    className="border-b mt-2 mb-2"
                                  ></span>
                                ) : (
                                  <a
                                    className="px-4 py-2 hover:bg-stone-50 text-md"
                                    href={subItem.href}
                                    key={index}
                                  >
                                    {subItem.name}
                                  </a>
                                )
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {right}
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      "text-stone-900 hover:bg-stone-100 ",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                    aria-current={"page"}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
               
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
};

export default Navbar;
