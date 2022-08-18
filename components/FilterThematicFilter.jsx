import Image from "next/image";
import { classNames } from "./utils";

export const FilterThematicFilter = ({ thematicFilter, handleThematicFilter }) => {
  return (
    <div className="py-4 w-full overflow-x-auto">
    <h3 className="text-xs font-semibold uppercase pb-2">Special Sort</h3>
    <section className="flex">
    <button
      value="highProtein"
      key="highProtein"
      onClick={handleThematicFilter}
      className={classNames(
        thematicFilter == "highProtein"
          ? "text-orange-600 bg-stone-100 shadow-inner font-medium"
          : " text-stone-700 hover:text-stone-900 hover:bg-stone-100 ",
        "whitespace-nowrap py-2 px-3 rounded-l-lg  text-sm md:text-base  border flex items-center shrink-0"
      )}
    >
        <img
          className="h-6 w-6 mr-2 hidden md:block"
          src={`/images/icons/muscle.webp`}
        />
        High Protein
    </button>
    <button
      value="lowCarb"
      key="lowCarb"
      onClick={handleThematicFilter}
      className={classNames(
        thematicFilter == "lowCarb"
          ? "text-red-600 bg-stone-100 shadow-inner font-medium"
          : " text-stone-700 hover:text-stone-900 hover:bg-stone-100 ",
        "whitespace-nowrap py-2 px-3 text-sm md:text-base border flex items-center shrink-0"
      )}
    >
      <img className="h-6 w-6 mr-2 hidden md:block" src={`/images/icons/leaf.webp`} />
      Low Carb
    </button>
    <button
      value="lowSodium"
      key="lowSodium"
      onClick={handleThematicFilter}
      className={classNames(
        thematicFilter == "lowSodium"
        ? "text-red-600 bg-stone-100 shadow-inner font-medium"
          : " text-stone-700 hover:text-stone-900 hover:bg-stone-100 ",
        "whitespace-nowrap py-2 px-3 text-sm md:text-base border flex items-center shrink-0"
      )}
    >
      <img
        className="h-6 w-6 mr-2 hidden md:block"
        src={`/images/icons/sodium.webp`}
      />
      Low Sodium
    </button>
    <button
     value="lowCholesterol"
      key="lowCholesterol"
      onClick={handleThematicFilter}
      className={classNames(
        thematicFilter == "lowCholesterol"
        ? "text-red-600 bg-stone-100 shadow-inner font-medium "
          : " text-stone-700 hover:text-stone-900 hover:bg-stone-100 ",
        "whitespace-nowrap py-2 px-3 rounded-r-lg text-sm md:text-base border flex items-center shrink-0"
      )}
    >
      <img className="h-6 w-6 mr-2 hidden md:block" src={`/images/icons/heart.webp`} />
      Low Cholesterol
    </button>
    {/* <a
      value="keto"
      key="keto"
      onClick={handleThematicFilter}
      className={classNames(
        thematicFilter == "keto"
        ? "text-red-600 bg-stone-100 shadow-inner font-medium "
          : " text-stone-700 hover:text-stone-900 hover:bg-stone-100  shadow-sm",
        "whitespace-nowrap py-2 px-4 rounded-lg text-base flex items-center border shadow-sm"
      )}
    >
      <img className="h-6 w-6 mr-2" src={`/images/icons/avocado.webp`} />
      Keto
    </a> */}
  </section>
</div>
  );
};
