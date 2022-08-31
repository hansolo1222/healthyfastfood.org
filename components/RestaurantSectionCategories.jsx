import Image from "next/image";

export const RestaurantSectionCategories = ({
  restaurant,
  categories
}) => {
  return (
    <section className="w-full bg-white mobile-padding ">
    <section className="pt-2 pb-2 md:pb-4 md:pt-4">
      <h2 className="font-semibold text-base md:text-lg mb-2">
        All Categories
      </h2>
      <div className="flex flex-wrap">
        {categories.map((cat) => {
          return (
            <a
              key={cat.categorySlug}
              href={`/${restaurant.slug}#${cat.categorySlug}`}
              className="border py-1 px-3 rounded-full text-blue-600 mr-1 mb-1 md:mr-2 md:mb-2 text-sm"
            >
              {cat.categoryName}
            </a>
          );
        })}
      </div>
    </section>
    </section>

  );
};
