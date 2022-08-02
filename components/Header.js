import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
//import { signOut, useSession } from "next-auth/react";
import { useRef } from "react";

import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const menu = [
  {key:"High Protein Entrees", "url":"/best/", "name":"High Protein Entrees"},
  {key:"High Protein Burgers & Sandwiches", "url":"/best/protein/burgers-sandwiches", "name":"High Protein Burgers & Sandwiches"},
  {key:"High Protein Salads", "url":"e", "name":"High Protein Salads"},

  {key:"High Protein Steaks", "url":"e", "name":"High Protein Steaks"},

  {key:"High Protein Burritos", "url":"e", "name":"High Protein Burritos"},
  {key:"High Protein Tacos", "url":"e", "name":"High Protein Tacos"},
  {key:"High Protein Bowls", "url":"e", "name":"High Protein Bowls"},



]

const categoriesMenu = [
  {key:"Burgers & Sandwiches", "url":"/category/burgers-sandwiches", "name":"Burgers & Sandwiches"},
  {key:"Salads", "url":"/category/salads", "name":"Salads"},

  {key:"Steaks", "url":"/category/steaks", "name":"Steaks"},

  {key:"Burritos", "url":"/category/burritos", "name":"Burritos"},

  {key:"Tacos", "url":"/category/tacos", "name":"Tacos"},
  {key:"Pasta", "url":"/category/pasta", "name":"Pasta"},
  {key:"High Protein Bowls", "url":"/category/bowls", "name":"Bowls"},



]


const Header = () => {
  const router = useRouter();
 const isActive = (pathname) =>
    router.pathname === pathname;

 // const { data: session, status } = useSession();

  let right = null;

  const navigation = [
    { name: "All Restaurants", href: "/restaurants" },
    { name: "Best of Lists", href: "/restaurants" },
    { name: "Calculators", href: "/restaurants" },
    { name: "Coupons", href: "/restaurants" },

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

  return (
        <Disclosure as="nav" className="bg-white border-b">
          {({ open }) => (
            <>
              <div className="max-w-8xl mx-auto px-3 sm:px-6 md:px-12 bg-white">
                <div className="relative flex items-center justify-beeen h-16">
                  <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex-shrink-0 flex items-center">
                      {/* <img
                        className="block lg:hidden h-10 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                        alt="Workflow"
                      /> */}
                    <Link href="/">

                      <img
                        className="block h-12 w-auto cursor-pointer"
                        src="/logo.svg"
                        alt="HealthyFastFood.org"
                      />
                      </Link>
                    </div>
                    {/* <div className="hidden sm:block sm:ml-6"> */}
                      <div className="sm:flex space-x-4 items-center ml-6 hidden">
                        
                        <Link href="/restaurants">
                        <a
                           
                            className={classNames(
                              'text-stone-900 hover:bg-stone-100',
                              'px-3 py-2 rounded-md text-sm font-medium'
                            )}
                            aria-current={'page'}
                          >
                            All Restaurants
                          </a>
                          </Link>

                          <Dropdown name="Food Categories" url="/categories" subItems={categoriesMenu} useHover={true}/>

                          <Dropdown name="Building Muscle" url="/protein" subItems={menu} useHover={true}/>

                          <Link href="/restaurants">
                        <a
                            key="Losing Weight"
                            className={classNames(
                              'text-stone-900 hover:bg-stone-100',
                              'px-3 py-2 rounded-md text-sm font-medium'
                            )}
                            aria-current={'page'}
                          >
                           Losing Weight
                          </a>
                          </Link>
                          
                      </div>
                           {/* 
                          <a
                            key="Best-Of Lists"
                            href="/best"
                            className={classNames(
                              'text-stone-900 hover:bg-stone-100',
                              'px-3 py-2 rounded-md text-sm font-medium'
                            )}
                            aria-current={'page'}
                          >
                            Best-Of Lists
                          </a> */}

                    {/* </div> */}
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
                         'text-stone-900 hover:bg-stone-100 ',
                        'block px-3 py-2 rounded-md text-base font-medium'
                      )}
                      aria-current={'page'}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>





    // <header className="border-0 sm:border-b bg-white">
    //   <nav className="max-w-8xl mx-auto px-3 sm:px-6 md:px-12" aria-label="Top">
    //     <div className="w-full py-4 flex items-center justify-beeen border-b md:border-none">
    //       <div className="flex items-center">
    //         <a href="/" className="flex items-center">
    //           <span className="sr-only">MinerList</span>

    //           <Image
    //             alt="MinerList Logo"
    //             src={`/images/logo.png`}
    //             width={143}
    //             height={38.5}
    //           />
    //         </a>
    //         <div className="hidden ml-10 space-x-8 md:block">
    //           {navigation.map((link) => (
    //             <a
    //               key={link.name}
    //               href={link.href}
    //               className="text-base font-medium  hover:text-blue-600"
    //             >
    //               {link.name}
    //             </a>
    //           ))}
    //         </div>
    //       </div>
    //       <div className="ml-10 space-x-4">
    //         {right}
    //       </div>
    //     </div>
    //     <div className="py-4 flex flex-wrap justify-center space-x-6 md:hidden">
    //       {navigation.map((link) => (
    //         <a
    //           key={link.name}
    //           href={link.href}
    //           className="text-base font-medium  hover:text-blue-500"
    //         >
    //           {link.name}
    //         </a>
    //       ))}
    //     </div>
    //   </nav>
    // </header>

  );
};

export default Header;



const Dropdown = ({ name, url, subItems, useHover }) => {
  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)
  const timeoutDuration = 200
  let timeout

  const openMenu = () => buttonRef?.current.click()
  const closeMenu = () =>
    dropdownRef?.current?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      })
    )

  const onMouseEnter = closed => {
    clearTimeout(timeout)
    closed && openMenu()
  }
  const onMouseLeave = open => {
    open && (timeout = setTimeout(() => closeMenu(), timeoutDuration))
  }

  return (
    <Menu>
      {({ open }) => (
        <div className="z-20">
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className=""
            onClick={openMenu}
            onMouseEnter={() => useHover && onMouseEnter(!open)}
            onMouseLeave={() => useHover && onMouseLeave(open)}
          >
            <Menu.Button
              ref={buttonRef}
              className='text-stone-900 hover:bg-stone-100 background-white shadow-none
                              px-3 py-2 rounded-md text-sm font-medium focus:outline-none border-none'
                
                
                
              
              as={useHover ? 'a' : 'button'}
              href={useHover ? url : null}
            >
              <span>{name}</span>
              {/* <svg className={`w-5 h-5 ml-2 -mr-1`} viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d={
                    `M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 ` +
                    `1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z`
                  }
                  clipRule="evenodd"
                />
              </svg> */}
            </Menu.Button>
          </div>

          <Transition
            show={open}
            enter="transition ease-out duration-10"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-10"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              ref={dropdownRef}
              onMouseEnter={() => useHover && onMouseEnter()}
              onMouseLeave={() => useHover && onMouseLeave(open)}
              static
              className={
                `absolute top-0 w-64 mt-2 origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none z-20`
              }
            >
              <div className={`py-1`}>
                {subItems.map(item => (
                  <Menu.Item key={item.key}>
                    {({ active }) => (
                      <Link href={item.url}>
                      <a
                        
                        className={`
                         ${active ? `bg-gray-100 text-gray-900` : `text-gray-700`}
                          flex justify-beeen w-full px-4 py-2 leading-5 text-left`
                        }
                      >
                        {item.name}
                      </a>
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </div>
      )}
    </Menu>
  )
}