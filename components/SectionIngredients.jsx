export const SectionIngredients = ({ meal }) => {
  return (
    <section>
      <h2 className="font-bold text-2xl mt-8 mb-6 pt-8 border-t">
        Ingredients
      </h2>
      {meal.ingredients !== null ? (
        <div dangerouslySetInnerHTML={{ __html: meal.ingredients }}></div>
      ) : (
        <div className="text-stone-600">
          We don&apos;t have this information yet!
        </div>
      )}
    </section>
  );
};
