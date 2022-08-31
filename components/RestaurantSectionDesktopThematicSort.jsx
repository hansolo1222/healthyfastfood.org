import Image from "next/image";
import { Breadcrumbs } from "./Breadcrumbs";
import { FilterThematicFilter } from "./FilterThematicFilter";

export const RestaurantSectionDesktopThematicSort = ({thematicFilter, setThematicFilter, setShowCustomRow }) => {
  return (
    <section>
    <div className="hidden md:block pt-2 md:pt-4 ">
              <h2 className="font-semibold text-lg ">Show</h2>
            </div>
            <div className="hidden md:block z-30 pt-2 top-0 sticky bg-white pb-2 border-b">
              <FilterThematicFilter
                thematicFilter={thematicFilter}
                setThematicFilter={setThematicFilter}
                setShowCustomRow={setShowCustomRow}
              />
            </div>  
            </section>       
  );
};
