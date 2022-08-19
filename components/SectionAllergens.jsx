import { PlusIcon, MinusIcon } from "@heroicons/react/outline";

export const SectionAllergens = ({ meal }) => {
  return (
    <section>
      <h2 className="font-bold text-2xl mt-8 mb-6 pt-8 border-t" id="allergens">Allergens</h2>
      {meal.allergensTrue.length > 0 && meal.allergensFalse.length > 0 ? (
        <div className="grid-cols-1 md:grid-cols-3 grid gap-8 mt-8">
          <div className="bg-stone-50 p-5 rounded-lg">
            <h3 className="font-bold">Contains allergens:</h3>
            {meal.allergensTrue.map((allergen) => (
              <li className="list-none flex items-center" key={allergen}>
                <PlusIcon className="h-5 w-5 mr-2" />
                {allergen}
              </li>
            ))}
          </div>
          <div className="bg-stone-50 p-5 rounded-lg">
            <h3 className="font-bold">Does not contain allergens:</h3>
            {meal.allergensFalse.map((allergen) => (
              <li className="list-none flex items-center" key={allergen}>
                <MinusIcon className="h-5 w-5 mr-2" />
                {allergen}
              </li>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-stone-600">
          We don&apos;t have this information yet!
        </div>
      )}
    </section>
  );
};
