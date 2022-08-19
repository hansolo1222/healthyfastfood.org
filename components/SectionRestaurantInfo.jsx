import {
  IdentificationIcon,
  OfficeBuildingIcon,
  ClipboardListIcon,
  UserIcon,
  CollectionIcon,
} from "@heroicons/react/outline";

export const SectionRestaurantInfo = ({ restaurant }) => {
  return (
    <section className="">
      <h2 className="font-bold text-2xl mt-8 mb-6 pt-8 border-t" id="restaurant-information">
        About This Restaurant
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-6 gap-4 grid-cols-4">
        <div>
          <div className="icon-wrapper bg-stone-50 rounded-xl p-2 w-8 h-8 flex">
            <IdentificationIcon className="h-4 w-4 text-stone-500 m-0" />
          </div>
          <p className="font-semibold text-sm mt-1 mb-0">Name</p>
          <p className="text-lg text-stone-600">{restaurant.name}</p>
        </div>
        <div>
          <div className="icon-wrapper bg-stone-50 rounded-xl p-2 w-8 h-8 flex">
            <ClipboardListIcon className="h-4 w-4 text-stone-500 m-0" />
          </div>
          <p className="font-semibold text-sm mt-1 mb-0">US Rank</p>
          <p className="text-lg text-stone-600">{restaurant.rank}</p>
        </div>
        <div>
          <div className="icon-wrapper bg-stone-50 rounded-xl p-2 w-8 h-8 flex">
            <OfficeBuildingIcon className="h-4 w-4 text-stone-500 m-0" />
          </div>
          <p className="font-semibold text-sm mt-1 mb-0">Locations</p>
          <p className="text-lg text-stone-600">{restaurant.locations}</p>
        </div>
        <div>
          <div className="icon-wrapper bg-stone-50 rounded-xl p-2 w-8 h-8 flex">
            <CollectionIcon className="h-4 w-4 text-stone-500 m-0" />
          </div>
          <p className="font-semibold text-sm mt-1 mb-0">Food Type</p>
          <p className="text-lg text-stone-600">
            {restaurant.restaurantType.name}
          </p>
        </div>
        <div>
          <div className="icon-wrapper bg-stone-50 rounded-xl p-2 w-8 h-8 flex">
            <UserIcon className="h-4 w-4 text-stone-500 m-0" />
          </div>
          <p className="font-semibold text-sm mt-1 mb-0">Service Type</p>
          <p className="text-lg text-stone-600">{restaurant.segment.name}</p>
        </div>
      </div>
    </section>
  );
};
