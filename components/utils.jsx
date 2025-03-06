
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const getCustomNutritionRowInfo = (filter) => {
  let units
  let title
  let direction
  if (filter == "highProtein"){
    units = "g / cal"
    title = "Protein per Calorie"
    direction = "descending"}
    else if (filter == "percentFromProtein"){
      units = "%"
      title = "% of calories from protein"
      direction = "descending"
    } else if (filter == "lowCarb"){
    units = "g / cal"
    title = "Carbs per Calorie"
    direction = "ascending"
    } else if (filter == "lowSodium"){
    units = "mg / cal"
    title = "Sodium per Calorie"
    direction = "ascending"
    } else if (filter == "lowCholesterol"){
    units = "mg / cal",
    title = "Cholesterol per Cal"
    direction = "ascending"
    } else if (filter == "proteinCarbRatio"){
      units = ": 1",
      title = "Protein:Carb Ratio"
      direction = "descending"
      } 
      else if (filter == "fiber"){
        units = "g",
        title = "Dietary Fiber"
        direction = "descending"
        } 

   return {units: units, title: title, direction: direction}
}

export const getUmbrellaCategory = (item) => {
  if (["Beverages", "Coffee", "Alcohol", "Shakes"].includes(item)) {
    return "beverages";
  } else if (["Dressings & Sauces", "Toppings"].includes(item)) {
    return "condiments";
  } else {
    return "food";
  }
};

//----------------------------- FILTER UTILS -----------------------------

export const handleAllergens = (event, allergens, setAllergens) => {
  let allergen = event.target.id;
  allergens.includes(allergen)
    ? setAllergens(allergens.filter((value) => value !== allergen))
    : setAllergens(allergens.concat(allergen));
};

//--------------------- RESTAURANT PAGE GENERAL ----------------------------

//calculate nutrition for special row

export const formatMealsWithVariants = (meals) => meals.map((meal) => {
  if (meal.variants.length > 0) {
    if (meal.variants[0].subvariants.length > 0) {
      let fullName = `${meal.name} (${meal.variants[0].variantName}) (${meal.variants[0].subvariants[0].subvariantName})`;
      return {
        ...meal,
        ...meal.variants[0].subvariants[0],
        categoryName: meal.category.name,
        name: fullName,
      };
    } else {
      let fullName = `${meal.name} (${meal.variants[1].variantName})`;
      return {
        ...meal,
        ...meal.variants[1],
        categoryName: meal.category.name,
        name: fullName,
        variantName: meal.variants[1].variantName,
      };
    }
  } else return meal;
});

export const calculateCustomNutrition = (thematicFilter, m) => {
  if (thematicFilter == "highProtein") {
    return m.calories == 0 ? 0 : (m.protein / m.calories).toFixed(3);
  }
    else if (thematicFilter == "percentProtein") {
      return m.calories == 0 ? 0 : ((m.protein * 4 / m.calories) * 100).toFixed(1);
    
  } else if (thematicFilter == "lowCarb") {
    return m.calories == 0
      ? 0
      : (m.totalCarbohydrates / m.calories).toFixed(3);
  } else if (thematicFilter == "lowSodium") {
    return m.calories == 0 ? 0 : (m.sodium / m.calories).toFixed(3);
  } else if (thematicFilter == "lowCholesterol") {
    return m.calories == 0 ? 0 : (m.cholesterol / m.calories).toFixed(3);
  } else if (thematicFilter == "proteinCarbRatio") {
    return m.calories == 0
      ? 0
      : (m.protein / m.totalCarbohydrates).toFixed(2);
  } else if (thematicFilter == "fiber") {
    return m.calories == 0 ? 0 : m.dietaryFiber;
  }
};

  // // Don't use this right now: this is filter for category
  // export const handleFilter = (filter) => {
  //   setFilters(filter);
  //   // filters.includes(filter)
  //   //   ? setFilters(filters.filter((value) => value !== filter))
  //   //   : setFilters(filters.concat(filter));
  // };

  // .filter((item) => {
  //   if (filters.length == 0) {
  //     return true;
  //   } else {
  //     return categories
  //       .map((c) => {
  //         return filters.includes(c) && item.category.name === c;
  //       })
  //       .includes(true);
  //   }
  // })


export const filterItems = (items, umbrellaCategories, allergens, minCalories, maxCalories, addOns) => {
  if (addOns) {
    items = items.filter((item) => item.netCarbohydrates < addOns.limit)
  }
  
  return items
    .filter(
      (item) => item.calories >= minCalories && item.calories <= maxCalories
    )
    .filter((item) => {
      return umbrellaCategories.includes(
        getUmbrellaCategory(item.category.parentCategory.name)
      );
    })
    .filter((item) => {
      // If no allergens selected, show all items
      if (allergens.length === 0) {
        return true;
      }
      
      // Check if item contains any of the selected allergens
      return allergens.every(allergen => {
        console.log(allergens)
        // If the allergen field is true, the item contains the allergen
        // If it's null or false, the item doesn't contain the allergen
        return item[allergen] !== true;
      });
    });
};


export const getCategoriesFromMeals = (meals) => {
  return [...new Set(meals.map((item) => item.category.name))];
}

export const getCategoriesWithParentsFromMeals = (meals) => {
  return meals
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
}

export const sortCategories = (categoriesWithParents) => categoriesWithParents.sort((a, b) => {
  if (
    getUmbrellaCategory(a.parentCategory) ==
    getUmbrellaCategory(b.parentCategory)
  ) {
    return 0;
  } else if (getUmbrellaCategory(a.parentCategory) === "food") {
    return -1;
  }
});