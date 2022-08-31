import Image from "next/image";
import { Breadcrumbs } from "./Breadcrumbs";
import { FilterThematicFilter } from "./FilterThematicFilter";

export const RestaurantSectionTextBlock = (
  props,
  { thematicFilter, setThematicFilter, setShowCustomRow }
) => {
  return (
    <section className="pt-8 bg-white mobile-padding pb-4">
      <p className="text-stone-900 md:text-base text-sm font-medium">
        Updated August 1, 2022
      </p>
      {props.children}
    </section>
  );
};
