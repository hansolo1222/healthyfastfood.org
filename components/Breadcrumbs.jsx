import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from 'next/image';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid'


export const Breadcrumbs = ({pages}) => {
  return(
<nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
          <li key="all miners">
            <div>
              <Link
                  href="/"
                  
                >
                <div className="text-sm font-medium text-stone-400 hover:text-stone-700 cursor-pointer">
                 <HomeIcon className="w-5 h-5"/>
                 </div>
                </Link>
            </div>
          </li>
          {pages.map((page, index) => (
            <li key={page.name}>
              <div className="flex items-center">
                <ChevronRightIcon className="flex-shrink-0 h-5 w-5 text-stone-400" aria-hidden="true" />
                <Link
                  href={page.href}
                  
                  aria-current={page.current ? 'page' : undefined}
                >
                <div className="ml-4 text-sm font-medium text-stone-400 hover:text-stone-700 cursor-pointer">
                  {page.name}
                  </div>
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>
  )
}