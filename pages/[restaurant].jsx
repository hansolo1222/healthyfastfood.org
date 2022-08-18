import Head from "next/head";
import Image from "next/image";
//import styles from '../styles/Home.module.css'
import Header from "../components/Header";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useSortableData } from "../components/UseSortableData";
import { useFilteredData } from "../components/UseFilteredData";
//let glob = require( 'glob' ), path = require( 'path' );
//import recursiveReaddirFiles from 'recursive-readdir-files';
import Link from "next/link";
import { formatCategory, formatParentCategory } from ".";
import { useRouter } from "next/router";
import { Breadcrumbs } from "../components/Breadcrumbs";
import prisma from "../lib/prisma";
import { NextSeo } from "next-seo";
import { Tabs } from "../components/Tabs";
import { Slider } from "@mui/material";
import { classNames, getCustomNutritionRowInfo } from "../components/utils";
import { AsideFilterByCalories } from "../components/AsideFilterByCalories";
import { AsideFilterByUmbrellaCategories } from "../components/AsideFilterByUmbrellaCategory";
import { AsideAllergens } from "../components/AsideAllergens";
import { AsideTopRestaurants } from "../components/AsideTopRestaurants";
import { FilterThematicFilter } from "../components/FilterThematicFilter";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { TableHeaders, TableMealRow } from "../components/TableMealRow";
import Select from "react-select";

export const getServerSideProps = async (context) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: String(context.params?.restaurant),
    },
    include: {
      meals: {
        include: {
          category: {
            include: {
              parentCategory: true,
            },
          },
          variants: {
            include: {
              subvariants: true,
            },
          },
          
        },
      },
      restaurantType: true,
    },
  });

  const restaurantType = restaurant.restaurantType.slug


  const restaurants = await prisma.restaurant.findMany({
    where: {
      restaurantType: {
        slug: restaurantType
      }
    },
    orderBy: [
      {
        rank: "asc",
      },
    ],
  });

  const groupedMeals = await prisma.meal.groupBy({
    by: ["categoryName"],
    where: {
      restaurant: {
        slug: String(context.params?.restaurant),
      },
    },
  });

  if (!restaurant) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      restaurant: JSON.parse(JSON.stringify(restaurant)),
      restaurants: JSON.parse(JSON.stringify(restaurants)),
      groupedMeals: JSON.parse(JSON.stringify(groupedMeals)),
    },
  };
};

const getUmbrellaCategory = (item) => {
  if (["Beverages", "Coffee", "Alcohol", "Shakes"].includes(item)) {
    return "beverage";
  } else if (["Dressings & Sauces", "Toppings"].includes(item)) {
    return "condiment";
  } else {
    return "food";
  }
};

export default function Restaurant(props) {
  const router = useRouter();

  const { restaurant, restaurants, groupedMeals } = props;

  const pages = [
    { name: "All Restaurants", href: `/restaurants` },
    { name: restaurant.name, href: `/${restaurant.slug}` },
  ];

  // format meals with variants

  let meals = restaurant.meals.map((meal) => {
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

  meals = meals.map((meal) => {
    return { ...meal, categoryName: meal.category.name };
  });

  let categories = [...new Set(meals.map((item) => item.category.name))];

  let categoriesWithParents = meals
    .map((item) => ({
      categoryName: item.category.name,
      parentCategory: item.category.parentCategory.name,
    }))
    .filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.categoryName === value.categoryName &&
            t.parentCategory === value.parentCategory
        )
    );

  categoriesWithParents.sort((a, b) => {
    if (
      getUmbrellaCategory(a.parentCategory) ==
      getUmbrellaCategory(b.parentCategory)
    ) {
      return 0;
    } else if (getUmbrellaCategory(a.parentCategory) === "food") {
      console.log(
        getUmbrellaCategory(a.parentCategory),
        getUmbrellaCategory(b.parentCategory)
      );
      return -1;
    }
  });

  const [mealData, setMealData] = useState(meals);

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


  //--------------------------- MOBILE FILTERS ---------------------------

  const handleSetMaxCaloriesMobile = (event) => {
    if (event !== null){
      setMaxCalories(event.value)
    } else {
      setMaxCalories(10000)
    }
  };

  const [showCalorieFilter, setShowCalorieFilter] = useState(false)
  const handleCalorieFilter = () => setCalorieFilter(true)

  const allergenOptions = [
    { value: 'gluten', label: 'Gluten Free' },
    { value: 'milk', label: 'Dairy Free' },
    { value: 'peanuts', label: 'No Peanuts' },
    { value: 'eggs', label: 'No Eggs' },
    { value: 'wheat', label: 'No Wheat' },
    { value: 'soy', label: 'No Soy' },
    { value: 'tree nuts', label: 'No Tree Nuts' },
    { value: 'fish', label: 'No Fish' },
    { value: 'shellfish', label: 'No Shellfish' }
  ]

  const calorieOptions = [
    { value: 100, label: 'Under 100cal' },
    { value: 300, label: 'Under 300cal' },
    { value: 500, label: 'Under 500cal' },
    { value: 800, label: 'Under 800cal' },
  ]



  return (
    <div className="">
      <NextSeo
        title={`${restaurant.name} Nutrition Facts and Calories | HealthyFastFood`}
        description={`Discover nutrition facts, macros, and the healthiest items at ${restaurant.name}`}
        canonical={`https://healthyfastfood.org/${restaurant.slug}`}
        additionalMetaTags={[
          {
            property: "keywords",
            content: `${restaurant.slug},nutrition,facts,`,
          },
        ]}
        openGraph={{
          url: "https://healthyfastfood.org/" + restaurant.slug,
          type: "website",
          title:
            restaurant.name +
            " Menu Nutrition Facts and Calories | Healthy Fast Food",
          description:
            "Discover nutrition facts, macros, and the healthiest items at " +
            restaurant.name,
          images: [
            {
              url: `/images/restaurant_logos/${restaurant.slug}.webp`,
              width: 400,
              height: 400,
              alt: restaurant.name + " Logo",
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
        <title>{restaurant.name} Nutrition | Healthy Fast Food</title>
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
            <AsideTopRestaurants restaurants={restaurants} />
          </aside>
          <main className="mt-4 md:mt-8 w-full">
            <div className="block md:hidden mb-2">
              <Breadcrumbs pages={pages} className="" />
            </div>
            <div className="flex items-center md:items-center">
              <div className="relative w-6 h-6 md:w-12 md:h-12 mr-2 md:mr-4">
                <Image
                  className=" flex-shrink-0 rounded-md mr-2 z-0"
                  src={`/images/logosSmall/${restaurant.slug}.webp`}
                  alt={`${restaurant.name} Logo`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div>
                <div className="hidden md:block">
                  <Breadcrumbs pages={pages} className="" />
                </div>
                <h1 className="text-lg md:text-xl lg:text-3xl font-bold mt-1">
                  {restaurant.name}{" "}
                  <span className="text-stone-500 font-normal">
                    Menu Nutrition Facts & Calories
                  </span>
                </h1>
              </div>
            </div>

            <div className="mt-4">
              <Tabs activeTab="all" />
            </div>

            {/* <p className=" text-stone-700 mt-4 max-w-3xl">Cheddar’s Scratch Kitchen is a sit-down restaurant chain focused on scratch-made home-style food served in an upscale casual setting. Menu items include appetizers, salads and soups, burgers and sandwiches, pasta, and entrees like steaks, chicken, seafood, and ribs. Beer, wine, and cocktails are also served. The chain prides itself on having double the number of cooks as similar restaurants so that food can be prepared fresh, fast, and made-to-order.</p>

            <h3 className="font-semibold mt-6 text-stone-700 uppercase">Eating Healthy at McDonald's</h3>
            <p className="max-w-3xl text-stone-700 mb-4">The extensive menu means there are ample choices for nearly every dietary lifestyle. For lighter fare, choose from a grilled chicken pecan salad or a warm roasted vegetable and quinoa salad, chicken tortilla soup, grilled salmon, lemon pepper chicken, and steamed broccoli. Meat-based entrees at Cheddar’s also offer protein-packed nutrition.</p> */}

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
                {/*  Custom job here, is it worth it?
                
                <button
                onClick={() => setShowCalorieFilter(!showCalorieFilter)}
                className="text-sm text-stone-700 peer border py-1 px-2 rounded-full flex items-center">
                  Calories <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />

                </button> */}
                {/* {showCalorieFilter && 
                <div
                  className="hidden peer-hover:flex hover:flex border
                w-[230px]
                flex-col bg-white drop-shadow-md top-10 absolute z-50 rounded-lg p-3"
                >
                  <AsideFilterByCalories
                    handleSetMaxCalories={handleSetMaxCalories}
                    handleSetMinCalories={handleSetMinCalories}
                  />
                </div>
                } */}
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

            <article className="overflow-x-auto w-full z-10">
              {categoriesWithParents.map((cat, i) => {
                return (
                  <div className="md:border shadow-sm mb-6 rounded-md overflow-hidden" key={cat.categoryName}>
                    <div className="py-3 md:mx-3 font-semibold border-b">
                      {cat.categoryName}
                    </div>
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
                          {items.filter((i) => i.categoryName == cat.categoryName).length > 0 ? (
                            items
                              .filter((i) => i.categoryName == cat.categoryName)
                              .map((meal) => (
                                <TableMealRow
                                  restaurantName={restaurant.name}
                                  restaurantSlug={restaurant.slug}
                                  showRestaurantData={false}
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
                );
              })}
              {/* 
              <table className="w-full divide-y divide-stone-300 rounded-lg">
                <thead className="rounded-t-lg">
                  <TableHeaders
                    showCustomRow={showCustomRow}
                    thematicFilter={thematicFilter}
                    SortableTableHeader={SortableTableHeader}
                  />
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white w-full">
                  {items.length > 0 ? (
                    items.map((meal) => (
                      <TableMealRow
                        restaurantName={restaurant.name}
                        restaurantSlug={restaurant.slug}
                        showRestaurantData={false}
                        meal={meal}
                        key={meal.mealName}
                        showCustomRow={showCustomRow}
                        customRowKey={thematicFilter}
                        customRowUnits={
                          getCustomNutritionRowInfo(thematicFilter).units
                        }
                      />
                    ))
                  ) : (
                    <tr className="">
                      <td
                        colSpan={8}
                        className="single-cell-row text-lg text-stone-500 text-center p-10"
                      >
                        Sorry! It looks like we don&apos;t have this data yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table> */}
            </article>
          </main>
        </div>
      </Layout>
    </div>
  );
}
