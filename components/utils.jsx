export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const getCustomNutritionRowInfo = (thematicFilter) => {
  let units
  let title
  let direction
  if (thematicFilter == "highProtein"){
    units = "g / cal"
    title = "Protein per Calorie"
    direction = "descending"
    } else if (thematicFilter == "lowCarb"){
    units = "g / cal"
    title = "Carbs per Calorie"
    direction = "ascending"
    } else if (thematicFilter == "lowSodium"){
    units = "mg / cal"
    title = "Sodium per Calorie"
    direction = "ascending"
    } else if (thematicFilter == "lowCholesterol"){
    units = "mg / cal",
    title = "Cholesterol per Cal"
    direction = "ascending"
    } else if (thematicFilter == "proteinCarbRatio"){
      units = ": 1",
      title = "Protein:Carb Ratio"
      direction = "descending"
      } 
      else if (thematicFilter == "fiber"){
        units = "g",
        title = "Dietary Fiber"
        direction = "descending"
        } 

   return {units: units, title: title, direction: direction}
}

export const getUmbrellaCategory = (item) => {
  if (["Beverages", "Coffee", "Alcohol", "Shakes"].includes(item)) {
    return "beverage";
  } else if (["Dressings & Sauces", "Toppings"].includes(item)) {
    return "condiment";
  } else {
    return "food";
  }
};