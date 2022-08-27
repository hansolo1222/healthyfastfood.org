import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from 'next/image';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid'


export const Breadcrumbs = ({pages}) => {
  return(
    <div className="overflow-x-auto w-full">
<nav className="flex " aria-label="Breadcrumb">
        <ol role="list" className="flex items-center">
         
         
          <li key="all miners" className="hidden md:block">
            <div className="flex items-center">
              <Link
                  href="/"
                  
                >
                <div className="text-sm font-medium text-stone-500 hover:text-stone-700 cursor-pointer">
                 <HomeIcon className="w-4 h-4 "/>
                 </div>
                </Link>
                <ChevronRightIcon className="ml-3 mr-3 flex-shrink-0 h-4 w-4 text-stone-500" aria-hidden="true" />

            </div>
          </li>


          {pages.map((page, index) => (
            <li key={page.name} className="">
              <div className="flex items-center whitespace-nowrap">
                {index!==0 && <ChevronRightIcon className="ml-2 md:ml-3 flex-shrink-0 h-4 w-4 text-stone-500" aria-hidden="true" />}
                <Link
                  href={page.href}
                  
                  aria-current={page.current ? 'page' : undefined}
                >
                <div className={`${index!==0 && 'ml-2 md:ml-3'} text-sm font-medium text-stone-500 hover:text-stone-700 cursor-pointer`}>
                  {page.name}
                  </div>
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>
      </div>
  )
}