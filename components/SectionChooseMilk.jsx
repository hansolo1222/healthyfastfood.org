export const SectionChooseMilk = ({ meal, restaurant }) => {
  return (
    <>
      <h2 className="font-bold text-2xl mt-8 mb-6">Choose Milk</h2>

      {meal.variants.map((variant) => {
        return (
          <div
            className="bg-stone-50 rounded-xl px-4 py-2 flex items-center mb-2 max-w-xl"
            key={variant.variantName}
          >
            <h3 className="text-xl font-bold">{variant.variantName}</h3>
            <a
              className="bg-red-500 hover:bg-red-700 text-white text-lg font-medium py-2 px-4 rounded ml-auto"
              href={`/${restaurant.slug}/${meal.slug}/${variant.variantSlug}`}
            >
              Select
            </a>
          </div>
        );
      })}
    </>
  );
};
