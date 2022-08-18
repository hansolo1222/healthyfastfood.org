import Image from "next/image";

export const AsideTopRestaurants = ({ restaurants }) => {
  if (restaurants.length >= 20) { restaurants = restaurants.slice(0,20) }
  return (
    <div className="mt-8 bg-stone-50 rounded-xl p-2">
      <h2 className="text-stone-500 text-xs uppercase font-semibold p-2 ">
        You might like
      </h2>
      {restaurants.map((restaurant) => (
        <div className="hover:bg-stone-200 rounded-xl" key={restaurant.slug}>
          <a
            href={`/${restaurant.slug}`}
            className="cursor-pointer w-full flex items-center p-2"
            key={restaurant.slug}
          >
            {/* <li key={restaurant.slug} className="list-decimal flex items-center py-1 px-3 rounded-lg hover:bg-stone-100 hover:text-red-500"> */}
            <div className="relative w-6 h-6">
              <Image
                className=" flex-shrink-0 rounded-md"
                src={`/images/logosSmall/${restaurant.slug}.webp`}
                alt={`${restaurant.name} Logo`}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="pl-2 text-stone-500 text-sm">{restaurant.name}</div>
          </a>
        </div>
      ))}
    </div>
  );
};
