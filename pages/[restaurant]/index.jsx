import Head from "next/head";
import Image from "next/image";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { useSortableData } from "../../components/UseSortableData";
import { useRouter } from "next/router";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import prisma from "../../lib/prisma";
import { NextSeo } from "next-seo";
import { Tabs } from "../../components/Tabs";
import {
  getCustomNutritionRowInfo,
  getUmbrellaCategory,
} from "../../components/utils";
import { AsideFilterByCalories } from "../../components/AsideFilterByCalories";
import { AsideFilterByUmbrellaCategories } from "../../components/AsideFilterByUmbrellaCategory";
import { AsideAllergens } from "../../components/AsideAllergens";
import { AsideTopRestaurants } from "../../components/AsideTopRestaurants";
import { FilterThematicFilter } from "../../components/FilterThematicFilter";
import { TableHeaders, TableMealRow } from "../../components/TableMealRow";
import Select from "react-select";
import { ShareIcons } from "../../components/ShareIcons";
import { InputLabel } from "@mui/material";
import { ChevronDownIcon } from "@heroicons/react/outline";
import EmailSignup from "../../components/EmailSignup";
import { Dialog, Transition, Fragment } from "@headlessui/react";
import { classNames } from "../../components/utils";
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/solid";
import ReactMarkdown from "react-markdown";

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

  const restaurantType = restaurant.restaurantType.slug;

  const restaurants = await prisma.restaurant.findMany({
    where: {
      restaurantType: {
        slug: restaurantType,
      },
    },
    orderBy: [
      {
        rank: "asc",
      },
    ],
  });

  // const groupedMeals = await prisma.meal.groupBy({
  //   by: ["categoryName"],
  //   where: {
  //     restaurant: {
  //       slug: String(context.params?.restaurant),
  //     },
  //   },
  // });

  if (!restaurant) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      restaurant: JSON.parse(JSON.stringify(restaurant)),
      restaurants: JSON.parse(JSON.stringify(restaurants)),
      // groupedMeals: JSON.parse(JSON.stringify(groupedMeals)),
    },
  };
};

export default function Restaurant(props) {
  const router = useRouter();

  const { restaurant, restaurants } = props;

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
      categorySlug: item.category.slug,
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

  console.log(categoriesWithParents);

  categoriesWithParents.sort((a, b) => {
    if (
      getUmbrellaCategory(a.parentCategory) ==
      getUmbrellaCategory(b.parentCategory)
    ) {
      return 0;
    } else if (getUmbrellaCategory(a.parentCategory) === "food") {
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
  const [maxCalories, setMaxCalories] = useState(5000);

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
    else if (thematicFilter == "proteinCarbRatio") {
      return m.calories == 0 ? 0 : (m.protein / m.totalCarbohydrates).toFixed(2);
    }
    else if (thematicFilter == "fiber") {
      console.log(m.fiber)
      return m.calories == 0 ? 0 : m.dietaryFiber;
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
    if (event !== null) {
      setMaxCalories(event.value);
    } else {
      setMaxCalories(10000);
    }
  };

  let [isOpen, setIsOpen] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [showCalorieFilter, setShowCalorieFilter] = useState(false);
  const [caloriePreset, setCaloriePreset] = useState({ name: null });
  const [mobileMinCalories, setMobileMinCalories] = useState(null);
  const [mobileMaxCalories, setMobileMaxCalories] = useState(null);
  const [caloriesMessage, setCaloriesMessage] = useState("");

  const handleCaloriePreset = (event, min, max) => {
    setCaloriePreset({ name: event.target.value, min: min, max: max });
  };

  const handleMinCalorieInput = (event) => {
    setCaloriePreset({ name: null });
    setMobileMinCalories(event.target.value);
  };

  const handleMaxCalorieInput = (event) => {
    setCaloriePreset({ name: null });
    setMobileMaxCalories(event.target.value);
  };

  const handleResetCalorieFilter = () => {
    setCaloriePreset({ name: null });
    setMobileMinCalories(null);
    setMobileMaxCalories(null);
    setMinCalories(0);
    setMaxCalories(5000);
    closeCalorieFilter();
  };

  const openCalorieFilter = () => {
    document.body.style.overflow = "hidden";
    setShowCalorieFilter(true);
  };

  const closeCalorieFilter = () => {
    document.body.style.overflow = "auto";
    setShowCalorieFilter(false);
  };

  const handleMobileCalorieFilterSubmit = (event) => {
    event.preventDefault();
    if (
      caloriePreset.name == null &&
      mobileMinCalories == null &&
      mobileMaxCalories == null
    ) {
      setCaloriesMessage("Please specify a calorie limit");
    } else {
      if (mobileMinCalories > mobileMaxCalories) {
        const tempMin = mobileMaxCalories;
        const tempMax = mobileMinCalories;
        setMobileMinCalories(tempMin);
        setMobileMinCalories(tempMax);
      }
      if (caloriePreset.name !== null) {
        setMinCalories(caloriePreset.min);
        setMaxCalories(caloriePreset.max);
      } else {
        mobileMaxCalories !== null && setMaxCalories(mobileMaxCalories);
        mobileMinCalories !== null && setMinCalories(mobileMinCalories);
      }
      closeCalorieFilter();
    }
  };

  const handleMobileCalorieFilterApply = () => {};

  const allergenOptions = [
    { value: "gluten", label: "Gluten Free" },
    { value: "milk", label: "Dairy Free" },
    { value: "peanuts", label: "No Peanuts" },
    { value: "eggs", label: "No Eggs" },
    { value: "wheat", label: "No Wheat" },
    { value: "soy", label: "No Soy" },
    { value: "tree nuts", label: "No Tree Nuts" },
    { value: "fish", label: "No Fish" },
    { value: "shellfish", label: "No Shellfish" },
  ];

  const calorieOptions = [
    { value: 100, label: "Under 100cal" },
    { value: 300, label: "Under 300cal" },
    { value: 500, label: "Under 500cal" },
    { value: 800, label: "Under 800cal" },
  ];

  const calorieFilters = [
    {
      min: 0,
      max: 200,
      name: "0-200",
      label: "0-200 calories",
    },
    {
      min: 200,
      max: 400,
      name: "200-400",
      label: "200-400 calories",
    },
    {
      min: 400,
      max: 600,
      name: "400-600",
      label: "400-600 calories",
    },
    {
      min: 600,
      max: 800,
      name: "600-800",
      label: "600-800 calories",
    },
    {
      min: 800,
      max: 10000,
      name: "800+",
      label: "800+ calories",
    },
  ];

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
        <div className="flex bg-stone-100 md:bg-white">
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
          <main className="w-full ">
            <section className="pt-3 md:pt-8 bg-white pb-3.5 md:pb-4 mobile-padding">
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
                      {restaurant.name}{" "}
                      <span className="text-stone-500 font-normal block md:inline">
                        Menu Nutrition Facts & Calories
                      </span>
                    </h1>
                    </div>
                    <div className="flex space-x-2">
                    <button
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
                        </button>
                      </div>
                      {/* <ShareIcons size={24} align="left" /> */}
                    </>
                  </div>
                </div>
              </div>
            </section>

            <div className="">
              <Tabs activeTab="all" slug={`/${restaurant.slug}`} />
            </div>
            <section className="w-full bg-white mobile-padding ">
            <section className="pt-8">
            <p className="text-stone-900 md:text-base text-sm font-medium">Updated August 1, 2022</p>

              <ReactMarkdown className="article-container max-w-2xl   ">
                {`Looking for full nutrition facts & calorie information for the ${
                  restaurant.name
                } Menu? We've crunched the data on protein, carbs, fat, and other macronutrients for every item on the ${
                  restaurant.name
                } menu, so you can sort through and filter results based on your dietary needs.


`}



              </ReactMarkdown>
              </section>
              <section className="pb-4 pt-4">
              <h2 className="font-semibold text-base md:text-lg mb-2">All Categories</h2>
              <div className="flex flex-wrap">
              {categoriesWithParents
                  .map((cat) => {
                    return <a href={`/${restaurant.slug}#${cat.categorySlug}`}
                      className="border py-1 px-3 rounded-full text-blue-600 mr-1 mb-1 md:mr-2 md:mb-2 text-sm"
                    >{cat.categoryName}</a>;
                  })}
              </div>   
              </section>
            </section>

            <div className="hidden md:block pt-2 md:pt-4 ">
            <h2 className="font-semibold text-lg ">Show</h2>
            </div>
            <div className="hidden md:block z-30 pt-2 top-0 sticky bg-white pb-2 border-b">
              <FilterThematicFilter
                thematicFilter={thematicFilter}
                handleThematicFilter={handleThematicFilter}
              />
            </div>
            

            <section
              className={`md:hidden sticky top-0 bg-white z-40 border-b border-stone-300`}
            >
              <div className="mobile-padding">
                <div
                  className={`${
                    !showCalorieFilter && "border-b"
                  } pt-2 pb-2 flex justify-between h-auto`}
                >
                  <div className="flex items-center space-x-4 ">
                    <button
                      onClick={openCalorieFilter}
                      className={`text-sm  peer py-1 flex items-center ${
                        showCalorieFilter ||
                        caloriePreset.name ||
                        mobileMaxCalories ||
                        mobileMinCalories
                          ? "text-red-600"
                          : "text-stone-700"
                      } `}
                    >
                      Calories{" "}
                      <ChevronDownIcon
                        className={` ml-1 h-3 w-3  ${
                          showCalorieFilter ? "text-red-500" : "text-stone-500"
                        } `}
                        aria-hidden="true"
                      />
                    </button>

                    {/* <button
                      onClick={() => setShowCalorieFilter(!showCalorieFilter)}
                      className="text-sm text-stone-700 peer py-1 flex items-center"
                    >
                      Allergens{" "}
                      <ChevronDownIcon
                        className=" ml-1 h-3 w-3 text-stone-500 "
                        aria-hidden="true"
                      />
                    </button> */}
                  </div>

                  <button
                    // onClick={() => setShowCalorieFilter(!showCalorieFilter)}
                    onClick={openModal}
                    className="text-sm text-stone-700 peer py-1 flex items-center"
                  >
                    Filters{" "}
                    <ChevronDownIcon
                      className=" ml-1 h-3 w-3 text-stone-500 "
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {!showCalorieFilter ? (
                  <FilterThematicFilter
                    thematicFilter={thematicFilter}
                    handleThematicFilter={handleThematicFilter}
                  />
                ) : (
                  <div className="flex justify-between py-2 border-b h-12 z-20">
                    <div className="text-lg">Calories</div>
                    <button
                      onClick={handleResetCalorieFilter}
                      className="text-blue-600 uppercase font-semibold"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>

            
              {/* before:bg-black/20 before: mobile-filter-popup */}
              <Transition appear show={showCalorieFilter} as={Fragment}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-100"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-100"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div
                    className={`absolute left-0 bottom-0 w-full h-0 before:bg-black/20 before: mobile-filter-popup ${
                      showCalorieFilter ? "active block " : "hidden"
                    }`}
                  >
                    

                    <div className="bg-white rounded-b-2xl z-50 absolute top-0 w-full mobile-padding pb-4">
                      <div className="inline-flex flex-wrap pt-4">
                        {calorieFilters.map((f, index) => {
                          return (
                            <button
                              value={f.name}
                              key={f.name}
                              onClick={(e) =>
                                handleCaloriePreset(e, f.min, f.max)
                              }
                              className={classNames(
                                caloriePreset.name == f.name
                                  ? " bg-white text-orange-600 border-orange-600"
                                  : " bg-stone-100 text-stone-600 hover:bg-stone-100 border-transparent",
                                "border rounded-full whitespace-nowrap py-1 md:py-2 px-3 md:px-3  text-sm md:text-base  flex items-center shrink-0 mb-3 mr-3"
                              )}
                            >
                              {f.label}
                            </button>
                          );
                        })}
                      </div>

                      <form onSubmit={handleMobileCalorieFilterSubmit}>
                        <div className="flex justify-between my-4">
                          <input
                            id="min-cal"
                            onChange={handleMinCalorieInput}
                            name="min-calories"
                            type="number"
                            className="appearance-none min-w-0 w-full bg-white border rounded-md py-2 px-4 text-base text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-700 focus:ring-white focus:border-white focus:placeholder-stone-400"
                            placeholder="Min calories"
                          />
                          <div className="mx-4 mt-2">—</div>
                          <input
                            id="max-cal"
                            onChange={handleMaxCalorieInput}
                            name="max-calories"
                            type="number"
                            className="appearance-none min-w-0 w-full bg-white border rounded-md py-2 px-4 text-base text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-700 focus:ring-white focus:border-white focus:placeholder-stone-400"
                            placeholder="Max calories"
                          />
                        </div>
                        {caloriesMessage ? (
                          <div className="mb-2 text-sm text-red-500">
                            {caloriesMessage}
                          </div>
                        ) : (
                          ``
                        )}
                        <button
                          type="submit"
                          className="w-full bg-red-500 text-lg py-2 font-medium rounded-full text-white uppercase"
                        >
                          Apply Filter
                        </button>
                      </form>
                    </div>

                    <div
                      className="absolute top-0 left-0 w-full h-screen"
                      onClick={closeCalorieFilter}
                    />
                  </div>
                </Transition.Child>
              </Transition>
            </section>

          

            <article className="overflow-x-auto w-full z-10 mt-4">
              {categoriesWithParents
                .filter((cat) =>
                  umbrellaCategories.includes(
                    getUmbrellaCategory(cat.parentCategory)
                  )
                )
                .map((cat, i) => {
                  return (
                    <div className="bg-white">
                    <h2 className="pb-2 pt-2 md:pt-4 mobile-padding text-base md:text-lg font-semibold border-b md:border-b-0" id={cat.categorySlug}>
                        {cat.categoryName}
                      </h2>
                    <div
                      className="md:border shadow-sm mb-3 md:mb-6 md:rounded-md overflow-hidden mobile-padding "
                      key={cat.categoryName}
                    >
                      
                      <div className="overflow-x-auto">
                        <table className="divide-y divide-stone-300 rounded-lg w-full  md:table-fixed ">
                          <thead className="rounded-t-lg sticky top-0">
                            {/* <tr className="bg-stone-800 text-white w-full pl-2">{group.categoryName}</tr> */}
                            <TableHeaders
                              showCustomRow={showCustomRow}
                              thematicFilter={thematicFilter}
                              SortableTableHeader={SortableTableHeader}
                            />
                          </thead>
                          <tbody className="divide-y divide-stone-200 bg-white w-full">
                            {items.filter(
                              (i) => i.categoryName == cat.categoryName
                            ).length > 0 ? (
                              items
                                .filter(
                                  (i) => i.categoryName == cat.categoryName
                                )
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
        <EmailSignup />
      </Layout>
    </div>
  );
}
