import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
//import { signOut, useSession } from "next-auth/react";


import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


const Header = () => {
  const router = useRouter();
 const isActive = (pathname) =>
    router.pathname === pathname;

 // const { data: session, status } = useSession();


  let right = null;

  const navigation = [
    { name: "All Restaurants", href: "/" },
    { name: "Blog", href: "/blog" },
    // {
    //   name: "BTC Profitability Calculator",
    //   href: "/bitcoin-profitability-calculator",
    // },
  ];

//   if (!session) {
    right = (
      <div>
      {/* <Link href="/login">
          <a className="text-base font-medium  hover:text-blue-600 mr-6">
            Log In
          </a>
        </Link> */}
      <Link href="/api/auth/signin">
        <a
         
          className="inline-block bg-blue-500 py-1 px-4 border border-transparent rounded-md text-md font-medium text-white hover:bg-opacity-75"
        >
          Sign Up
        </a>
      </Link>
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
//                       className="bg-gray-100 p-1.5 rounded-full text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
//                     >
//                       <span className="sr-only">View notifications</span>
//                       <BellIcon className="h-6 w-6" aria-hidden="true" />
//                     </a>
    
//                     {/* Profile dropdown */}
//                     <Menu as="div" className="ml-3 relative z-50">
//                       <div>
//                         <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none ">
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
//                                 className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
//                               >
//                                 Account Settings
//                               </a>
//                             )}
//                           </Menu.Item>
//                           {/* <Menu.Item>
//                             {({ active }) => (
//                               <a
//                                 href="#"
//                                 className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
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
//                                 className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
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
              <div className="max-w-8xl mx-auto px-3 sm:px-6 md:px-12">
                <div className="relative flex items-center justify-between h-16">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
                    <a href="/">

                      <img
                        className="block h-10 w-auto"
                        src="/logo.svg"
                        alt="Workflow"
                      />
                      </a>
                    </div>
                    <div className="hidden sm:block sm:ml-6">
                      <div className="flex space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              'text-gray-900 hover:bg-gray-100',
                              'px-3 py-2 rounded-md text-sm font-medium'
                            )}
                            aria-current={'page'}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  {right}
                </div>
              </div>
    
              <Disclosure.Panel className="sm:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                         'text-gray-900 hover:bg-gray-100 ',
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
    //     <div className="w-full py-4 flex items-center justify-between border-b md:border-none">
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
