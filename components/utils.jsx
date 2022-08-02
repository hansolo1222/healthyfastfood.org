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
    } 
   return {units: units, title: title, direction: direction}
}