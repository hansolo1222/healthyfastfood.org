"use client"

import { useSortableData } from "../../../components/UseSortableData"
import Image from "next/image"
import Link from "next/link"

export default function RestaurantTypeClient({ 
  type,
  restaurantTypes 
}: {
  type: any
  restaurantTypes: any[]
}) {
  const { 
    items,
    SortableTableHeader 
  } = useSortableData(type.restaurants, {
    key: "rank",
    direction: "ascending",
  })

  return (
    <div className="">
      <div className="mt-8 mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4">
          Most Popular {type.name} Restaurants 
        </h1>
        <p className="max-w-2xl text-sm text-center mx-auto text-stone-500">
          {type.description}
        </p>
      </div>

      <table className="max-w-3xl mx-auto divide-y divide-stone-300 rounded-lg">
        <thead className="rounded-t-lg">
          <tr>
            <td scope="col" className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-left">
              <SortableTableHeader colKey="name" name="Name" direction="ascending"/>
            </td>
            <td scope="col" className="px-3 py-2.5 text-sm font-semibold whitespace-nowrap text-greeny-600 text-center">
              <SortableTableHeader colKey="locations" name="# Locations" direction="descending"/>
            </td>
            <td scope="col" className="px-3 py-0.5 text-sm font-semibold whitespace-nowrap text-greeny-600 text-center hidden sm:table-cell">
              <SortableTableHeader colKey="segmentSlug" name="Service Type" direction="ascending"/>
            </td>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {items.map((restaurant) => (
            <tr className="hover:bg-stone-100" key={restaurant.id}>
              <td className="whitespace-nowrap py-2 px-2 text-md text-stone-900 text-left">
                <div className="flex items-center">
                  <Link href={`/${restaurant.slug}`} className="flex items-center">
                    <div className="relative w-10 h-10">
                      <Image
                        className="flex-shrink-0 rounded-md mr-4"
                        src={`/images/logosSmall/${restaurant.slug}.webp`}
                        alt={`${restaurant.name} Logo`}
                        fill
                        objectFit="contain"
                      />
                    </div>
                  </Link>

                  <Link
                    href={`/${restaurant.slug}`}
                    className="cursor-pointer block pl-2 -ml-px hover:text-red-500"
                  >
                    {restaurant.name}
                  </Link>
                </div>
              </td>
              <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center">
                {restaurant.locations}
              </td>
              <td className="whitespace-nowrap py-1 text-md text-stone-900 text-center hidden sm:table-cell">
                {restaurant.segment?.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 