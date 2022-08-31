import Image from "next/image";
import { Breadcrumbs } from "./Breadcrumbs";

export const RestaurantSectionHeader = ({pages, restaurant, titleBlack, titleGray }) => {
  return (<section className="pt-3 md:pt-8 bg-white pb-3.5 md:pb-4 mobile-padding">
              {/* Breadcrumbs for mobile */}
              <div className="block md:hidden">
                <Breadcrumbs pages={pages} className="" />
              </div>
              <div className="flex items-start md:items-center">
                <div className="relative w-12 h-12 md:w-14 md:h-14 mr-2 md:mr-4 mt-2 md:mt-0 flex-shrink-0">
                  <Image
                    className=" flex-shrink-0 rounded-xl mr-2 z-0"
                    src={`/images/logosSmall/${restaurant.slug}.webp`}
                    alt={`${restaurant.name} Logo`}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div className="w-full">
                <div className="md:flex justify-between items-center">

                  <>
                  <div>
                  <div className="hidden md:block">
                    <Breadcrumbs pages={pages} className="" />
                  </div>
                    <h1 className="text-lg md:text-xl lg:text-3xl font-bold mt-2 md:mt-1 leading-snug">
                      {titleBlack}
                      <span className="text-stone-500 font-normal block md:inline">
                        {titleGray}
                      </span>
                    </h1>
                    </div>
                    <div className="flex space-x-2">
                    {/* <button
                          type="submit"
                          className="mt-2 md:mt-0 bg-stone-100 hover:bg-stone-200 text-base py-2 px-3 font-medium rounded-lg text-stone-900 "
                        >
                          Share
                        </button>
                    <button
                          type="submit"
                          className="mt-2 md:mt-0 bg-red-500 hover:bg-red-600 text-base py-2 px-3 font-medium rounded-lg text-white "
                        >
                          Export to PDF
                        </button> */}
                      </div>
                      {/* <ShareIcons size={24} align="left" /> */}
                    </>
                  </div>
                </div>
              </div>
            </section>
  );
};
