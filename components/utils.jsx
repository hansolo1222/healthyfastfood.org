export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const getCustomNutritionRowInfo = (type) => {
  switch (type) {
    case "highProtein":
      return {
        title: "Protein/Cal",
        units: "g/cal",
        direction: "descending"
      };
    case "percentFromProtein":
      return {
        title: "% from Protein",
        units: "%",
        direction: "descending"
      };
    case "percentFromCarbs":
      return {
        title: "% from Carbs",
        units: "%",
        direction: "ascending"
      };
    case "lowCarb":
      return {
        title: "Carbs/Cal",
        units: "g/cal",
        direction: "ascending"
      };
    case "lowSodium":
      return {
        title: "Sodium/Cal",
        units: "mg/cal",
        direction: "ascending"
      };
    case "lowCholesterol":
      return {
        title: "Cholesterol/Cal",
        units: "mg/cal",
        direction: "ascending"
      };
    case "proteinCarbRatio":
      return {
        title: "Protein:Carb",
        units: ":1",
        direction: "descending"
      };
    case "fiber":
      return {
        title: "Fiber",
        units: "g",
        direction: "descending"
      };
    default:
      return {
        title: type,
        units: "",
        direction: "ascending"
      };
  }
};

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

export const calculateCustomNutrition = (type, meal) => {
  if (!type) return null;

  switch (type) {
    case "highProtein":
      return meal.calories == 0 ? 0 : (meal.protein / meal.calories).toFixed(3);
    
    case "percentFromProtein":
      const proteinCals = meal.protein * 4;
      const totalCals = meal.calories;
      // Always show one decimal place, even if it's .0
      return totalCals > 0 ? (((proteinCals / totalCals) * 100).toFixed(1)) : "0.0";
    
    case "percentFromCarbs":
      const carbCals = meal.totalCarbohydrates * 4;
      // Always show one decimal place, even if it's .0
      return meal.calories > 0 ? (((carbCals / meal.calories) * 100).toFixed(1)) : "0.0";
    
    case "lowCarb":
      return meal.calories == 0 ? 0 : (meal.totalCarbohydrates / meal.calories).toFixed(3);
    
    case "lowSodium":
      return meal.calories == 0 ? 0 : (meal.sodium / meal.calories).toFixed(3);
    
    case "lowCholesterol":
      return meal.calories == 0 ? 0 : (meal.cholesterol / meal.calories).toFixed(3);
    
    case "proteinCarbRatio":
      return meal.totalCarbohydrates == 0 ? 0 : (meal.protein / meal.totalCarbohydrates).toFixed(2);
    
    case "fiber":
      return meal.dietaryFiber;

    default:
      return null;
  }
};

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