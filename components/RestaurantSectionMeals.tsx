
import { TableMealRow,TableHeaders, KetoTableHeaders, KetoTableMealRow } from "./TableMealRow";
import { getCustomNutritionRowInfo } from "./utils";


export const RestaurantSectionMeals = (
  {
    restaurant,
    categoriesWithParents,
    showCustomRow,
    thematicFilter,
    SortableTableHeader,
    umbrellaCategories,
    getUmbrellaCategory,
    items,
    variant,
    showRestaurantData,
    group
  }) => {

  if (!group) {
    return (<div
    className="md:border shadow-sm mb-3 md:mb-6 md:rounded-md overflow-hidden mobile-padding bg-white"
  >
    <div className="overflow-x-auto bg-white">
      <table className="divide-y divide-stone-300 rounded-lg w-full  md:table-fixed ">
        <thead className="rounded-t-lg sticky top-0">
          {/* <tr className="bg-stone-800 text-white w-full pl-2">{group.categoryName}</tr> */}
          {variant=="normal" && <TableHeaders
            showCustomRow={showCustomRow}
            thematicFilter={thematicFilter}
            SortableTableHeader={SortableTableHeader}
          /> }
          {variant=="keto" && <KetoTableHeaders
            showCustomRow={showCustomRow}
            thematicFilter={thematicFilter}
            SortableTableHeader={SortableTableHeader}
          /> }
        </thead>
        <tbody className="divide-y divide-stone-200  w-full">
          {items
              .map((meal) => {
                
                if (variant=="normal") {return <TableMealRow
                  restaurantName={meal.restaurant.name}
                  restaurantSlug={meal.restaurant.slug}
                  showRestaurantData={showRestaurantData}
                  meal={meal}
                  key={meal.mealName}
                  showCustomRow={showCustomRow}
                  customRowKey={thematicFilter}
                  customRowUnits={
                    getCustomNutritionRowInfo(
                      thematicFilter
                    ).units
                  }
                />
                }
                if (variant=="keto") {return <KetoTableMealRow
                  restaurantName={restaurant.name}
                  restaurantSlug={restaurant.slug}
                  showRestaurantData={showRestaurantData}
                  meal={meal}
                  key={meal.mealName}
                  showCustomRow={showCustomRow}
                  customRowKey={thematicFilter}
                  customRowUnits={
                    getCustomNutritionRowInfo(
                      thematicFilter
                    ).units
                  }
                />
                }
              }
              )
          }
        </tbody>
      </table>
    </div>
  </div>
    )
  }

  return (
    <section className="overflow-x-auto w-full z-10 mt-4 bg-white">
    {categoriesWithParents
       .filter((cat) =>
       umbrellaCategories.includes(
         getUmbrellaCategory(cat.parentCategory)
       )
       )
      .map((cat, i) => {
        return (
          <div className="" key={cat.categoryName}>
            <h2
              className="pb-2 pt-2 md:pt-4 mobile-padding text-base md:text-lg font-semibold border-b md:border-b-0"
              id={cat.categorySlug}
            >
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
                    {variant=="normal" && <TableHeaders
                      showCustomRow={showCustomRow}
                      thematicFilter={thematicFilter}
                      SortableTableHeader={SortableTableHeader}
                    /> }
                    {variant=="keto" && <KetoTableHeaders
                      showCustomRow={showCustomRow}
                      thematicFilter={thematicFilter}
                      SortableTableHeader={SortableTableHeader}
                    /> }
                  </thead>
                  <tbody className="divide-y divide-stone-200 w-full">
                    {items.filter(
                      (i) => i.categoryName == cat.categoryName
                    ).length > 0 ? (
                      items
                        .filter(
                          (i) => i.categoryName == cat.categoryName
                        )
                        .map((meal) => {
                          
                          if (variant=="normal") {return <TableMealRow
                            restaurantName={restaurant.name}
                            restaurantSlug={restaurant.slug}
                            showRestaurantData={showRestaurantData}
                            meal={meal}
                            key={meal.mealName}
                            showCustomRow={showCustomRow}
                            customRowKey={thematicFilter}
                            customRowUnits={
                              getCustomNutritionRowInfo(
                                thematicFilter
                              ).units
                            }
                          />
                          }
                          if (variant=="keto") {return <KetoTableMealRow
                            restaurantName={restaurant.name}
                            restaurantSlug={restaurant.slug}
                            showRestaurantData={showRestaurantData}
                            meal={meal}
                            key={meal.mealName}
                            showCustomRow={showCustomRow}
                            customRowKey={thematicFilter}
                            customRowUnits={
                              getCustomNutritionRowInfo(
                                thematicFilter
                              ).units
                            }
                          />
                          }
                        }
                        )
                    ) : (
                      <tr className="">
                        <td
                          colSpan={8}
                          className="single-cell-row text-md text-stone-500 text-left md:text-center py-3 md:py-8 w-screen"
                        >
                          There are no items for this category or we don&apos;t have the data yet! <a className="text-red-500" href="">Let us know</a>
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
  </section>
  );
};

export default RestaurantSectionMeals