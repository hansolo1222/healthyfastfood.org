"use client"
import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
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

const Header = () => {
  const router = useRouter();
  const isActive = (pathname) => router.pathname === pathname;

  // const { data: session, status } = useSession();

  let right = null;

  const navigation = [
    {
      name: "Restaurants",
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
    { name: "About", href: "/about", secondLevel: false },
    { name: "Cookbook", href: "/cookbook", secondLevel: false },
  ];

  //   if (!session) {
  right = (
    <div>
      {/* <Link href="/api/auth/signin">
        <a
         
          className="inline-block bg-red-500 py-1 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
        >
          Sign Up
        </a>
      </Link> */}
    </div>
  );
  //   }

  //   if (session) {
  //     let firstLetter = session.user.email.charAt(0).toUpperCase()
  //     console.log(session)
  //     right = (
  //       <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
  //                     <a
  //                       type="button"
  //                       href="/watchlist"
  //                       className="bg-stone-100 p-1.5 rounded-full text-stone-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800 focus:ring-white"
  //                     >
  //                       <span className="sr-only">View notifications</span>
  //                       <BellIcon className="h-6 w-6" aria-hidden="true" />
  //                     </a>

  //                     {/* Profile dropdown */}
  //                     <Menu as="div" className="ml-3 relative z-50">
  //                       <div>
  //                         <Menu.Button className="bg-stone-800 flex text-sm rounded-full focus:outline-none ">
  //                           <span className="sr-only">Open user menu</span>
  //                           <div className="profile-bubble h-8 w-8 rounded-full flex align-middle justify-center text-white text-base">
  //                             <span className="mt-1">{firstLetter}</span>
  //                           </div>
  //                           {/* <img
  //                             className="h-8 w-8 rounded-full"
  //                             src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  //                             alt=""
  //                           /> */}
  //                         </Menu.Button>
  //                       </div>
  //                       <Transition
  //                         as={Fragment}
  //                         enter="transition ease-out duration-100"
  //                         enterFrom="transform opacity-0 scale-95"
  //                         enterTo="transform opacity-100 scale-100"
  //                         leave="transition ease-in duration-75"
  //                         leaveFrom="transform opacity-100 scale-100"
  //                         leaveTo="transform opacity-0 scale-95"
  //                       >
  //                         <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
  //                           <Menu.Item>
  //                             {({ active }) => (
  //                               <a
  //                                 href="/account"
  //                                 className={classNames(active ? 'bg-stone-100' : '', 'block px-4 py-2 text-sm text-stone-700')}
  //                               >
  //                                 Account Settings
  //                               </a>
  //                             )}
  //                           </Menu.Item>
  //                           {/* <Menu.Item>
  //                             {({ active }) => (
  //                               <a
  //                                 href="#"
  //                                 className={classNames(active ? 'bg-stone-100' : '', 'block px-4 py-2 text-sm text-stone-700')}
  //                               >
  //                                 Settings
  //                               </a>
  //                             )}
  //                           </Menu.Item> */}
  //                           <Menu.Item>
  //                             {({ active }) => (
  //                               <a
  //                                 href="#"
  //                                 onClick={() => signOut()}
  //                                 className={classNames(active ? 'bg-stone-100' : '', 'block px-4 py-2 text-sm text-stone-700')}
  //                               >
  //                                 Sign out
  //                               </a>
  //                             )}
  //                           </Menu.Item>
  //                         </Menu.Items>
  //                       </Transition>
  //                     </Menu>
  //                   </div>
  //     )
  //   }

  return <>
    {/* <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
        />
      </div>
      <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-md leading-6 text-gray-900">
          <strong className="font-semibold">
            HealthyFastFood.org will be changing its name soon
          </strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline h-0.5 w-0.5 fill-current"
            aria-hidden="true"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          Try the ad free experience now
        </p>
        <a
          href="https://mealrank.org"
          className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-md font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          Go to MealRank.org <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
        >
          <span className="sr-only">Dismiss</span>
          <XIcon className="h-5 w-5 text-gray-900" aria-hidden="true" />
        </button>
      </div>
    </div> */}

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
                  <Link href="/" legacyBehavior>
                    <img
                      className="block md:hidden h-8 w-auto"
                      src="/images/mark.svg"
                      alt="HealthyFastFood Mark"
                    />
                  </Link>
                  <Link href="/" legacyBehavior>
                    <img
                      className="hidden md:block h-10 w-auto cursor-pointer mr-4"
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
                            "hover:text-red-600 mr-4",
                            "py-1 rounded-md text-base font-medium",
                            item.secondLevel ? "peer" : ""
                          )}
                          aria-current={"page"}>

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
                                <span key={index} className="border-b mt-2 mb-2"></span>
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
              <Disclosure.Button
                key="About"
                as="a"
                href="/about"
                className={classNames(
                  "text-stone-900 hover:bg-stone-100 ",
                  "block px-3 py-2 rounded-md text-base font-medium"
                )}
                aria-current={"page"}
              >
                About
              </Disclosure.Button>
              <Disclosure.Button
                key="Donate"
                as="a"
                href="/donate"
                className={classNames(
                  "text-stone-900 hover:bg-stone-100 ",
                  "block px-3 py-2 rounded-md text-base font-medium"
                )}
                aria-current={"page"}
              >
                Donate
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  </>;
};

export default Header;
