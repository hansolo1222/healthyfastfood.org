export const SectionVariantsList = ({ meal, restaurant }) => {
  if (meal.subvariants.length > 0) {
    return (
      <section>
        <h2 className="font-bold text-2xl mt-8 mb-6">Variations</h2>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
          {meal.subvariants.map((variant) => {
            return (
              <div
                className="bg-stone-50 rounded-xl p-4"
                key={variant.subvariantName}
              >
                <h3 className="text-xl font-bold">{variant.subvariantName}</h3>
                <div className="flex justify-between items-center border-b py-2">
                  <dt className="text-base font-normal text-stone-900">
                    Calories
                  </dt>
                  <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div className="flex items-baseline text-2xl font-semibold text-green-600">
                      {variant.calories} kcal
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between items-center border-b py-2">
                  <dt className="text-base font-normal text-stone-900">
                    Protein
                  </dt>
                  <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div className="flex items-baseline text-xl font-semibold text-green-600">
                      {variant.protein}g
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between items-center border-b py-2">
                  <dt className="text-base font-normal text-stone-900">
                    Carbs
                  </dt>
                  <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div className="flex items-baseline text-xl font-semibold text-green-600">
                      {variant.totalCarbohydrates}g
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between items-center border-b py-2">
                  <dt className="text-base font-normal text-stone-900">Fat</dt>
                  <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div className="flex items-baseline text-xl font-semibold text-green-600">
                      {variant.totalFat}g
                    </div>
                  </dd>
                </div>
                <div className="flex justify-center">
                  <a
                    className="bg-red-500 hover:bg-red-700 text-white text-lg font-medium py-2 px-4 rounded mx-auto text-center mt-4"
                    href={`/${restaurant.slug}/${meal.slug}/${meal.variantSlug}/${variant.subvariantSlug}`}
                  >
                    View All Nutrition Facts
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }
  return (
    <section>
      <h2 className="font-bold text-2xl mt-8 mb-6">Variations</h2>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
        {meal.variants.map((variant) => {
          return (
            <div
              className="bg-stone-50 rounded-xl p-4"
              key={variant.variantName}
            >
              <h3 className="text-xl font-bold">{variant.variantName}</h3>
              <div className="flex justify-between items-center border-b py-2">
                <dt className="text-base font-normal text-stone-900">
                  Calories
                </dt>
                <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                  <div className="flex items-baseline text-2xl font-semibold text-green-600">
                    {variant.calories} kcal
                  </div>
                </dd>
              </div>
              <div className="flex justify-between items-center border-b py-2">
                <dt className="text-base font-normal text-stone-900">
                  Protein
                </dt>
                <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                  <div className="flex items-baseline text-xl font-semibold text-green-600">
                    {variant.protein}g
                  </div>
                </dd>
              </div>
              <div className="flex justify-between items-center border-b py-2">
                <dt className="text-base font-normal text-stone-900">Carbs</dt>
                <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                  <div className="flex items-baseline text-xl font-semibold text-green-600">
                    {variant.totalCarbohydrates}g
                  </div>
                </dd>
              </div>
              <div className="flex justify-between items-center border-b py-2">
                <dt className="text-base font-normal text-stone-900">Fat</dt>
                <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                  <div className="flex items-baseline text-xl font-semibold text-green-600">
                    {variant.totalFat}g
                  </div>
                </dd>
              </div>
              <div className="flex justify-center">
                <a
                  className="bg-red-500 hover:bg-red-700 text-white text-lg font-medium py-2 px-4 rounded mx-auto text-center mt-4"
                  href={`/${restaurant.slug}/${meal.slug}/${variant.variantSlug}`}
                >
                  View All Nutrition Facts
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
