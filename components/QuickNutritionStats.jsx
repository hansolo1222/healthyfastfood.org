export const QuickNutritionStats = ({ meal }) => {
  return (
    <dl className="max-w-lg mt-4 grid rounded-lg bg-white overflow-hidden border-stone-200  divide-stone-200 grid-cols-2 md:grid-cols-4 gap-2">
      <div className=" bg-stone-50 rounded-full py-2">
        <dd className=" flex justify-center items-baseline ">
          <div className="flex items-baseline text-xl font-semibold text-orange-600">
            {meal.calories}
          </div>
        </dd>
        <dt className="text-sm font-normal text-stone-600 text-center">
          Calories
        </dt>
      </div>
      <div className="bg-stone-50 rounded-full py-2 ">
        <dd className="flex justify-center items-baseline ">
          <div className="flex items-baseline text-xl font-semibold text-black-600">
            {meal.protein}g
          </div>
        </dd>
        <dt className="text-sm font-normal text-stone-600 text-center">
          Protein
        </dt>
      </div>
      <div className="bg-stone-50 rounded-full py-2">
        <dd className="flex justify-center items-baseline ">
          <div className="flex items-baseline text-xl font-semibold text-black-600">
            {meal.totalFat}g
          </div>
        </dd>
        <dt className="text-sm font-normal text-stone-600 text-center">
          Total Fat
        </dt>
      </div>
      <div className="bg-stone-50 rounded-full py-2">
        <dd className=" flex justify-center items-baseline ">
          <div className="flex items-baseline text-xl font-semibold text-black-600">
            {meal.totalCarbohydrates}g
          </div>
        </dd>
        <dt className="text-sm font-normal text-stone-600 text-center">
          Total Carbs
        </dt>
      </div>
    </dl>
  );
};

