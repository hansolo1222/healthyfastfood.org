import { getCustomNutritionRowInfo } from "./utils";
import Image from "next/image";
export const TableMealRow = ({
  restaurantName,
  restaurantSlug,
  showRestaurantData,
  meal,
  showCustomRow,
  customRowKey,
  customRowUnits
}) => {
  // let category = meal.category.parentCategorySlug != "uncategorized" ? meal.category.parentCategorySlug : meal.category.name
  let category = meal.category.name
  return (
    <tr className="mealRow cursor-pointer hover:bg-stone-50 hover:shadow-sm">
      <td className="md:pr-1 py-1.5 text-sm md:text-base text-stone-900 sticky z-20 md:static left-0 bg-white md:bg-transparent">
        <div className="flex items-center w-36 md:w-auto pr-2 md:pr-0">
          <a href={`/${restaurantSlug}`} className="flex items-center">
            {showRestaurantData ? (
              <div className="relative w-6 h-6 ml-2">
                <Image
                  className=" flex-shrink-0 rounded-md mr-2 "
                  src={`/images/logosSmall/${restaurantSlug}.webp`}
                  alt={`${restaurantName} Logo`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            ) : (
              ""
             
            )}
          </a>
              {/* <div className="text-lg border rounded-md h-7 w-7 flex items-center justify-center">{formatParentCategory(meal.category.parentCategorySlug, false, true, false)}</div> */}

          <a
            href={`/${restaurantSlug}/${meal.slug}`}
            className="hover:text-red-500 md:ml-3"
          >
            {showRestaurantData && (
              <div className="text-xs text-stone-500">{restaurantName}</div>
            )}
            <span className="">{meal.name}</span>
          </a>
        </div>
      </td>
      {/* <td className="whitespace-nowrap py-1 text-base text-stone-900 text-center">
        {formatParentCategory(category, true, true, true)}
      </td> */}
      {showCustomRow && 
        <td className="whitespace-nowrap px-1 py-1 text-sm md:text-base text-stone-900 text-center bg-green-50">
          {meal[customRowKey]} <span className="text-stone-500 text-sm ">{customRowUnits}</span>
        </td>
      }
      <td className=" py-1 text-sm md:text-base text-stone-900 text-center font-medium">
        {meal.calories}<span className="text-stone-500 text-sm"></span>
      </td>
      <td className="whitespace-nowrap py-1 text-sm md:text-base text-stone-900 text-center">
        {meal.protein}<span className="text-stone-500 text-sm">g</span>
      </td>
      <td className="whitespace-nowrap py-1 text-sm md:text-base text-stone-900 text-center">
        {meal.totalCarbohydrates}
        <span className="text-stone-500 text-sm">g</span>
      </td>
      <td className="whitespace-nowrap py-1 text-sm md:text-base text-stone-900 text-center">
        {parseFloat(meal.totalFat).toFixed(0)}<span className="text-stone-500 text-sm">g</span>
      </td>
      <td className="whitespace-nowrap  py-1 text-sm md:text-base text-stone-900 text-center">
        {meal.cholesterol}<span className="text-stone-500 text-sm">mg</span>
      </td>
      <td className="whitespace-nowrap  py-1 text-sm md:text-base text-stone-900 text-center">
        {meal.sodium}<span className="text-stone-500 text-sm">mg</span>
      </td>
      <td className="whitespace-nowrap  py-1 text-sm md:text-base text-stone-900 text-center">
        {meal.sugar}<span className="text-stone-500 text-sm">g</span>
      </td>
     
    </tr>
  );
};



export const TableHeaders = ({showCustomRow, thematicFilter, SortableTableHeader}) => {
  return(
    <tr>
  <th
  scope="col"
  className="md:pl-2 py-3 text-sm font-semibold text-greeny-600 text-left first-letter:
  sticky z-20 md:static w-20 left-0 bg-white
  "
  style={{'width':'43%'}}

>
  <div className="flex items-center">
    {/* <div className="ml-8">
        <SortableTableHeader
          colKey="restaurant"
          name="Restaurant"
        />
      </div> */}
    <div className="">
      <SortableTableHeader
        colKey="name"
        name="Name"
        direction="ascending"
      />
    </div>
  </div>
</th>
{/* <th
  scope="col"
  className="py-3.5 text-sm font-semibold text-stone-900"
>
  <SortableTableHeader
    colKey="categoryName"
    name="Type"
    direction="ascending"
  />
</th> */}

{showCustomRow && (
  <th
    scope="col"
    className="pl-3 py-3 whitespace-nowrap text-center text-sm font-semibold text-stone-900 bg-green-100"
    style={{'width':'13%'}}
  >
    <SortableTableHeader
      colKey="customNutritionRow"
      name={getCustomNutritionRowInfo(thematicFilter).title}
      direction={
        getCustomNutritionRowInfo(thematicFilter).direction
      }
    />
  </th>
)}

<th
  scope="col"
  className="px-1 py-3 text-sm font-semibold text-stone-900 text-center"
>
  <SortableTableHeader
    colKey="calories"
    name="Calories"
    direction="ascending"
  />
</th>
<th
  scope="col"
  className="px-1 py-3 text-sm font-semibold text-stone-900 text-center "
>
  <SortableTableHeader
    colKey="protein"
    name="Protein"
    direction="descending"
  />
</th>
<th
  scope="col"
  className="px-1 py-3 text-sm font-semibold text-stone-900 text-center "
>
  <SortableTableHeader
    colKey="totalCarbohydrates"
    name="Carbs"
    direction="ascending"
  />
</th>
<th
  scope="col"
  className="px-1 py-3 text-sm font-semibold text-stone-900 text-center "
>
  <SortableTableHeader
    colKey="totalFat"
    name="Fat"
    direction="ascending"
  />
</th>
<th
  scope="col"
  className="px-1 py-3 text-sm font-semibold text-stone-900 text-center"
>
  <SortableTableHeader
    colKey="cholesterol"
    name="Cholesterol"
    direction="ascending"
  />
</th>
<th
  scope="col"
  className="px-1 py-3 text-sm font-semibold text-stone-900 text-center"
>
  <SortableTableHeader
    colKey="sodium"
    name="Sodium"
    direction="ascending"
  />
</th>
<th
  scope="col"
  className="px-1 py-3 text-center text-sm font-semibold text-stone-900"
>
  <SortableTableHeader
    colKey="sugar"
    name="Sugar"
    direction="ascending"
  />
</th>
</tr>
  )
}


export const formatParentCategory = (category, includeElement, includeEmoji, includeText) => {
  let text = ""
  let color = ""
  let emoji = ""

  if (category=="burgers-sandwiches") {
    emoji = "🍔";
    text = "Burgers & Sandwiches";
    color = "red";
  } 
  else if (category=="steaks") {
    emoji = "🥩"
    text = "Steak";
    color = "red";
  } 
  else if (category=="salads") {
    emoji = "🥗"
    text = "Salad";
    color = "green";
  } 
  else if (category=="burritos") {
    emoji = "🌯"
    text = "Burrito";
    color = "yellow";
  } 
  else if (category=="tacos") {
    emoji = "🌮"
    text = "Taco";
    color = "yellow";
  } 
  else if (category=="pizzas") {
    emoji = "🍕"
    text = "Pizza";
    color = "orange";
  } 
  else if (category=="soups") {
    emoji = "🍲"
    text = "Soup";
    color = "blue";
  } 
  else if (category=="bowls") {
    emoji = "🥣"
    text = "Bowl";
    color = "blue";
  } 
  else if (category=="pastas") {
    emoji = "🍝"
    text = "Pasta";
    color = "orange";
  } 
  else if (category=="pastries") {
    emoji = "🥐"
    text = "Pastry";
    color = "orange";
  } 
  else if (category=="breads") {
    emoji = "🍞"
    text = "Bread";
    color = "orange";
  } 
  else if (category=="dressings-sauces") {
    emoji = "🥫"
    text = "Dressings & Sauces";
    color = "stone";
  } 
  else if (category=="toppings") {
    emoji = "⬇️"
    text = "Toppings";
    color = "stone";
  } 
  else if (category=="sides") {
    emoji = "🍢"
    text = "Side";
    color = "blue";
  } 
  else if (category=="appetizers") {
    emoji = "🍽️"
    text = "Appetizer";
    color = "blue";
  } 
  else if (category=="breakfast") {
    emoji = "🍳"
    text = "Breakfast";
    color = "yellow";
  } 
  else if (category=="lunch-dinner") {
    emoji = "🥘"
    text = "Lunch & Dinner";
    color = "indigo";
  } 
  else if (category=="kids-meals") {
    emoji = "👶"
    text = "Kids Meal";
    color = "pink";
  } 
  else if (category=="senior-meals") {
    emoji = "🧓"
    text = "Senior Meal";
    color = "pink";
  } 

  else if (category=="beef") {
    emoji = "🐮"
    text = "Beef";
    color = "red";
  } 
  else if (category=="wings") {
    emoji = "🐓"
    text = "Wings";
    color = "yellow";
  } 
  else if (category=="chicken") {
    emoji = "🐔"
    text = "Chicken";
    color = "yellow";
  } 
  else if (category=="seafood") {
    emoji = "🐟"
    text = "Seafood";
    color = "stone";
  } 
  else if (category=="donuts") {
    emoji = "🍩"
    text = "Donuts";
    color = "indigo";
  } 
  else if (category=="desserts") {
    emoji = "🧁"
    text = "Dessert";
    color = "purple";
  } 
  else if (category=="ice-cream") {
    emoji = "🍦"
    text = "Ice Cream";
    color = "pink";
  } 

  else if (category=="beverages") {
    emoji = "🥤"
    text = "Beverage";
    color = "blue";
  } 
  else if (category=="coffee") {
    emoji = "☕"
    text = "Coffee";
    color = "stone";
  } 
  else if (category=="shakes") {
    emoji = "🥤"
    text = "Shake";
    color = "pink";
  } 
  else if (category=="alcohol") {
    emoji = "🍺"
    text = "Alcohol";
    color = "red";
  } 
  else {
    text = category;
    color = "teal";
  }

  let finalString = 
    (includeEmoji ? emoji : "") 
    + (includeEmoji && includeText ? " " : "") 
    + (includeText ? text : "")

  if (includeElement) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-stone-800`}
      >
        {finalString}
      </span>
    );
  } else {
    return finalString
  }
};