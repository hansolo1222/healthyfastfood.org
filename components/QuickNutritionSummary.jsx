export const QuickNutritionSummary = ({ meal, restaurantName }) => {
  return (
    <p className="text-stone-500 mt-4 ">
      The {restaurantName} {meal.name} contains <b>{meal.calories} calories</b>
      , <b>{meal.protein}g </b>
      protein, <b>{meal.totalCarbohydrates}g</b> total carbohydrates and{" "}
      <b>{meal.totalFat}g</b> total fat.
    </p>
  );
};
