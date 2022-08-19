import Head from "next/head";
import Image from "next/image";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { useSortableData } from "../../components/UseSortableData";
import Link from "next/link";
import { useRouter } from "next/router";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import prisma from "../../lib/prisma";
import { NextSeo } from "next-seo";
import { FoodCategoryTabs } from "../../components/Tabs";
import { classNames, getCustomNutritionRowInfo, getUmbrellaCategory } from "../../components/utils";
import { AsideFilterByCalories } from "../../components/AsideFilterByCalories";
import { AsideFilterByUmbrellaCategories } from "../../components/AsideFilterByUmbrellaCategory";
import { AsideAllergens } from "../../components/AsideAllergens";
import { AsideTopRestaurants } from "../../components/AsideTopRestaurants";
import { FilterThematicFilter } from "../../components/FilterThematicFilter";
import { TableHeaders, TableMealRow } from "../../components/TableMealRow";
import Select from "react-select";
import { formatParentCategory } from "../../components/TableMealRow";
export const getServerSideProps = async (context) => {
  
  const parent = await prisma.parentCategory.findUnique({
    where: {
      slug: String(context.params?.categorySlug)
    },
    include: {
      categories: {
        include: {
          meals: {
            include: {
              restaurant: true,
              category: {
                include: {
                  parentCategory: true
                }
              },
              variants: {
                include: {
                  subvariants: true
                }
              }
            }
          }
        }
      }
    }
  })

  const parentCategories = await prisma.parentCategory.findMany()

  const restaurants = await prisma.restaurant.findMany({
    orderBy: [
      {
        rank: "asc",
      },
    ],
  });

  return {
    props: {
      parent: JSON.parse(JSON.stringify(parent)),
      parentCategories: JSON.parse(JSON.stringify(parentCategories)),
      restaurants: JSON.parse(JSON.stringify(restaurants)),
    },
  };
};


export default function Category(props) {
  const router = useRouter();

  let {parentCategories, parent, restaurants} = props;

  console.log(parent.categories)


  let meals = parent.categories.flatMap((cat)=>(cat.meals))
  

  let category = parent
  let data = parent

  // let categories = [...new Set(meals.map((item) => item.category.name))];

  const pages = [
    { name: "Categories", href: `/categories` },
    { name: category.name, href: `/category/${category.slug}` },
  ];

 //format meals with variants

  meals = meals.map((meal) => {
    if (meal.variants.length > 0) {
      if (meal.variants[0].subvariants.length > 0) {
        let fullName = `${meal.name} (${meal.variants[0].variantName}) (${meal.variants[0].subvariants[0].subvariantName})`;
        return {
          ...meal,
          ...meal.variants[0].subvariants[0],
          name: fullName,
        };
      } else {
        let fullName = `${meal.name} (${meal.variants[1].variantName})`;
        return {
          ...meal,
          ...meal.variants[1],
          name: fullName,
          variantName: meal.variants[1].variantName,
        };
      }
    } else return meal;
  });


  const [mealData, setMealData] = useState(meals);
  console.log(mealData)



  const [filters, setFilters] = useState([]);

  const [umbrellaCategories, setUmbrellaCategories] = useState([
    "food",
    "beverage",
  ]);
  const [allergens, setAllergens] = useState([]);

  const [minCalories, setMinCalories] = useState(0);
  const [maxCalories, setMaxCalories] = useState(2000);


  const [thematicFilter, setThematicFilter] = useState();
  const [showCustomRow, setShowCustomRow] = useState(false);

  const handleFilter = (filter) => {
    setFilters(filter);
    // filters.includes(filter)
    //   ? setFilters(filters.filter((value) => value !== filter))
    //   : setFilters(filters.concat(filter));
  };

  const handleUmbrellaCategories = (e) => {
    let filter = e.target.id;
    umbrellaCategories.includes(filter)
      ? setUmbrellaCategories(
          umbrellaCategories.filter((value) => value !== filter)
        )
      : setUmbrellaCategories(umbrellaCategories.concat(filter));
  };

  const handleThematicFilter = (event) => {
    let inputted = event.target.value;
    if (thematicFilter == inputted) {
      setThematicFilter(null);
      setShowCustomRow(false);
    } else {
      setThematicFilter(event.target.value);
      setShowCustomRow(true);
    }
  };

  const handleAllergens = (event) => {
    let allergen = event.target.id;
    allergens.includes(allergen)
      ? setAllergens(allergens.filter((value) => value !== allergen))
      : setAllergens(allergens.concat(allergen));
  };

  const handleSetMaxCalories = (event) => {
    setMinCalories(0);
    setMaxCalories(event.target.value);
  };
  

  const handleSetMinCalories = (event) => {
    setMinCalories(event.target.value);
    setMaxCalories(5000);
  };

  useEffect(() => {
    setMealData(
      filteredItems(
        meals.map((m) => {
          return {
            ...m,
            [thematicFilter]: calculateCustomNutrition(thematicFilter, m),
          };
        })
      )
    );
    requestSort(
      thematicFilter,
      getCustomNutritionRowInfo(thematicFilter).direction
    );
  }, [
    thematicFilter,
    showCustomRow,
    umbrellaCategories,
    maxCalories,
    minCalories,
    allergens,
  ]);

  const calculateCustomNutrition = (thematicFilter, m) => {
    if (thematicFilter == "highProtein") {
      return m.calories == 0 ? 0 : (m.protein / m.calories).toFixed(3);
    } else if (thematicFilter == "lowCarb") {
      return m.calories == 0
        ? 0
        : (m.totalCarbohydrates / m.calories).toFixed(3);
    } else if (thematicFilter == "lowSodium") {
      return m.calories == 0 ? 0 : (m.sodium / m.calories).toFixed(3);
    } else if (thematicFilter == "lowCholesterol") {
      return m.calories == 0 ? 0 : (m.cholesterol / m.calories).toFixed(3);
    }
  };

  const filteredItems = (items) =>
    items
      .filter(
        (item) => item.calories >= minCalories && item.calories <= maxCalories
      )
      .filter((item) => {
        if (filters.length == 0) {
          return true;
        } else {
          return categories
            .map((c) => {
              return filters.includes(c) && item.category.name === c;
            })
            .includes(true);
        }
      })
      .filter((item) => {
        return umbrellaCategories.includes(
          getUmbrellaCategory(item.category.parentCategory.name)
        );
      })
      .filter((item) => {
        if (allergens.length == 0) {
          return true;
        } else {
          return !allergens
            .map((allergen) => {
              return item.allergensFalse.includes(allergen);
            })
            .includes(false);
        }
      });

  let {
    items,
    requestSort,
    requestSortPreserveDirection,
    sortConfig,
    SortableTableHeader,
    SortableTableHeaderInverse,
    SortableTableHeaderROI,
  } = useSortableData(mealData, {
    key: "name",
    direction: "ascending",
  });

  return (
    <div className="">
      <NextSeo
        title={`Nutrition Facts and Calories | Healthy Fast Food`}
        description={`Discover nutrition facts, macros, and the healthiest items at ${category.name}`}
        canonical={`https://healthyfastfood.org/category/${category.slug}`}
        additionalMetaTags={[
          {
            property: "keywords",
            content: `${category.slug},nutrition,facts,`,
          },
        ]}
        openGraph={{
          url: "https://healthyfastfood.org/" + category.slug,
          type: "website",
          title:
            category.name +
            " | Healthy Fast Food",
          description:
            "Discover nutrition facts, macros, and the healthiest items at " +
            category.name,
          images: [
            {
              url: `/images/restaurant_logos/${category.slug}.webp`,
              width: 400,
              height: 400,
              alt: category.name + " Logo",
            },
          ],
        }}
        twitter={{
          handle: "@healthyfastfood",
          site: "https://healthyfastfood.org",
          cardType: "summary_large_image",
        }}
      />
      <Head>
        <title>{category.name} Nutrition | Healthy Fast Food</title>
        <meta name="description" content="" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex">
          <aside className="hidden lg:block shrink-0 pb-10 w-56 pr-8">

          <AsideFilterByCalories
              handleSetMaxCalories={handleSetMaxCalories}
              handleSetMinCalories={handleSetMinCalories}
            />
            <AsideFilterByUmbrellaCategories
              umbrellaCategories={umbrellaCategories}
              handleUmbrellaCategories={handleUmbrellaCategories}
            />
            <AsideAllergens
              allergens={allergens}
              handleAllergens={handleAllergens}
            />

          <div className="mt-8 bg-stone-50 rounded-xl p-2">
              <h2 className="text-stone-500 text-xs uppercase font-semibold p-2 ">
                Food Categories
              </h2>
              {parentCategories.filter((c)=>c.slug!=="uncategorized").map((category) => (
                <div
                  className="hover:bg-stone-200 rounded-xl"
                  key={category.slug}
                >
                  <a
                    href={`/category/${category.slug}`}
                    className="cursor-pointer w-full flex items-center p-2"
                    key={category.slug}
                  >
                    {/* <li key={restaurant.slug} className="list-decimal flex items-center py-1 px-3 rounded-lg hover:bg-stone-100 hover:text-red-500"> */}
                    <div className="relative w-6 h-6">
                      {/* <Image
                        className=" flex-shrink-0 rounded-md"
                        src={`/images/categoriesClipArt/${category.slug}.webp`}
                        alt={`${category.name} Illustration`}
                        layout="fill"
                        objectFit="contain"
                      /> */}
                      {formatParentCategory(category.slug, false, true, false)}
                    </div>
                    <div className="pl-2 text-stone-500 text-sm">
                      {category.name}
                    </div>
                  </a>
                </div>
              ))}
            </div>
            
          </aside>
          <main className="mt-4 md:mt-8 w-full">
            <div className="block md:hidden mb-2">
                <Breadcrumbs pages={pages} className="" />
              </div>
              <div className="flex items-center md:items-center">
                <div className="w-6 h-6 md:w-12 md:h-12 mr-2 md:mr-4 border flex items-center justify-center rounded">
                  {/* <Image
                    className=" flex-shrink-0 rounded-md mr-2 z-0"
                    src={`/images/logosSmall/${restaurant.slug}.webp`}
                    alt={`${restaurant.name} Logo`}
                    layout="fill"
                    objectFit="contain"
                  /> */}
                  <div className=" md:text-3xl">
                  {formatParentCategory(category.slug,false,true,false)}
                  </div>
                </div>
                <div>
                  <div className="hidden md:block">
                    <Breadcrumbs pages={pages} className="" />
                  </div>
                  <h1 className="text-lg md:text-xl lg:text-3xl font-bold mt-1">
                  All {category.name}{" "}, Ranked by Nutrition
                    {/* <span className="text-stone-500 font-normal">
                      Menu Nutrition Facts & Calories
                    </span> */}
                  </h1>
                </div>
              </div>

            <div className="mt-4">
              <FoodCategoryTabs activeTab="all" />
            </div>

            <FilterThematicFilter
              thematicFilter={thematicFilter}
              handleThematicFilter={handleThematicFilter}
            />

<div className="md:hidden sticky top-0 bg-white z-40 pb-2 border-b">
            <div className="">
              <h3 className="text-xs font-semibold uppercase pb-2">
                Filter
              </h3>
              <div className="flex space-x-2">  
                <Select 
                  options={calorieOptions} 
                  isClearable={true}
                  placeholder="By Calories"
                  onChange={handleSetMaxCaloriesMobile}
                  />
                {/* <div className="text-sm text-stone-700 peer border py-1 px-2 rounded-full flex items-center">
                  Allergens <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                </div> */}
                <Select 
                  options={allergenOptions} 
                  isMulti
                  placeholder="+ Allergies"
                  onChange={setAllergens}
                  />

              </div>
              </div>
            </div>


            <article className="">
            <div className="md:border shadow-sm mb-6 rounded-md overflow-hidden" >
                    
                    <div className="overflow-x-auto">
                      <table className="divide-y divide-stone-300 rounded-lg w-full  md:table-fixed ">
                        <thead className="rounded-t-lg">
                          {/* <tr className="bg-stone-800 text-white w-full pl-2">{group.categoryName}</tr> */}
                          <TableHeaders
                            showCustomRow={showCustomRow}
                            thematicFilter={thematicFilter}
                            SortableTableHeader={SortableTableHeader}
                          />
                        </thead>
                        <tbody className="divide-y divide-stone-200 bg-white w-full">
                          {items.length > 0 ? (
                            items
                              .map((meal) => (
                                <TableMealRow
                                  restaurantName={meal.restaurant.name}
                                  restaurantSlug={meal.restaurantSlug}
                                  showRestaurantData={true}
                                  meal={meal}
                                  key={meal.mealName}
                                  showCustomRow={showCustomRow}
                                  customRowKey={thematicFilter}
                                  customRowUnits={
                                    getCustomNutritionRowInfo(thematicFilter)
                                      .units
                                  }
                                />
                              ))
                          ) : (
                            <tr className="">
                              <td
                                colSpan={8}
                                className="single-cell-row text-md text-stone-500 text-center p-8"
                              >
                                No items found!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>



            
            </article>
          </main>
        </div>
      </Layout>
    </div>
  );
}





