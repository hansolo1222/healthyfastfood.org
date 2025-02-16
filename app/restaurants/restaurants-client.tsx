"use client"

import { useSortableData } from "../../components/UseSortableData"
import { ShareIcons } from "../../components/ShareIcons"
import Image from "next/image"
import Link from "next/link"

export default function RestaurantsClient({ 
  restaurants,
  restaurantTypes 
}: {
  restaurants: any[]
  restaurantTypes: any[]
}) {
  const { 
    items,
    SortableTableHeader 
  } = useSortableData(restaurants, {
    key: "rank",
    direction: "ascending",
  })

  return (
    <div className="mobile-padding">
      <div className="mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-center mb-4 mt-8">
          Most Popular Restaurants by Category
        </h1>
        <div className="">
          <ShareIcons size={28} align="center"/>
        </div>
      </div>

      <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-8">
        {restaurantTypes.map((type) => (
          <div className="col-span-1 border rounded-lg shadow-md" key={type.name}>
            <div className="mx-4 pb-4 mt-4 border-b h-auto md:h-40">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {type.name} Restaurants
                </h2>
                <Link
                  href={`/restaurants/${type.slug}`}
                  className="text-red-500 border border-red-500 font-semibold px-2 py-1 text-sm rounded"
                >
                  View All
                </Link>
              </div>
              <p className="text-stone-500 text-sm">
                {type.description}                 
              </p>
            </div>

            <table className="divide-y divide-stone-300 rounded-lg w-full table-fixed">
              <thead className="rounded-t-lg">
                <tr>
                  <th scope="col" className="px-3 py-0.5 text-sm font-semibold text-greeny-600 text-left" style={{width:'80%'}}>
                    <SortableTableHeader
                      colKey="name"
                      name="Name"
                      direction="ascending"
                    />
                  </th>
                  <th scope="col" className="pr-3 py-2.5 text-sm font-semibold whitespace-nowrap text-greeny-600 text-right">
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
                  .map((restaurant) => (
                    <tr className="hover:bg-stone-100" key={restaurant.id}>
                      <td className="py-2 pl-4 text-md text-stone-900 text-left">
                        <div className="flex items-center">
                          <Link href={`/${restaurant.slug}`} className="flex items-center">
                            <div className="relative w-7 h-7">
                              <Image
                                className="flex-shrink-0 rounded-md mr-2"
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
                          {restaurant._count.meals === 0 && (
                            <span className="text-xs border text-stone-500 ml-2 px-2 py-0.5 rounded-full">
                              No Data
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-1 text-md text-stone-900 text-right pr-4">
                        {restaurant.locations}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
} 