import Image from "next/image";
import { classNames, handleThematicFilter } from "./utils";


export const FilterThematicFilter = ({thematicFilter, setThematicFilter, setShowCustomRow }) => {
  const filters = [
  {
    name: "percentFromProtein",
    image: 'muscle.webp',
    label: "Protein as % of calories"
  },
  {
    name: "proteinCarbRatio",
    image: 'ratio.webp',
    label: "Protein:Carb Ratio"
  },
  {
    name: "lowCarb",
    image: 'bread.webp',
    label: "Carbs per Cal"
  },
  {
    name: "lowSodium",
    image: 'sodium.webp',
    label: "Sodium per Cal"
  },
  {
    name: "lowCholesterol",
    image: 'heart.webp',
    label: "Cholesterol per Cal"
  },
  {
    name: "fiber",
    image: 'leaf.webp',
    label: "Fiber"
  },
]

const handleThematicFilter = (event) => {
  let inputted = event.target.value;
  if (thematicFilter == inputted) {
    setThematicFilter(null);
    setShowCustomRow(false);
  } else {
    setThematicFilter(event.target.value);
    setShowCustomRow(true);
  }
};

  return (
    <div className="py-2 md:py-0 w-full overflow-x-auto flex h-12 md:h-auto ">
    <section className="flex space-x-2">
    {filters.map((f, index)=>{
      return (<button
      value={f.name}
      key={f.name}
      onClick={handleThematicFilter}
      className={classNames(
        thematicFilter == f.name
          ? " bg-white text-green-600 border-green-500"
          : " bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-100 border-transparent",
        "border rounded-full whitespace-nowrap py-1 md:py-2 px-3 md:px-3  text-sm md:text-base  flex items-center shrink-0 "
      )}
    >
        <img
          className="h-6 w-6 mr-2 hidden md:block"
          src={`/images/icons/${f.image}`}
        />
        {f.label}
    </button>)
    })}
{/*    
    <button
      value="lowCarb"
      key="lowCarb"
      onClick={handleThematicFilter}
      className={classNames(
        thematicFilter == "lowCarb"
          ? "text-red-600 bg-stone-100 shadow-inner font-medium"
          : " text-stone-700 hover:text-stone-900 hover:bg-stone-100 ",
        "whitespace-nowrap py-2 px-3 text-sm md:text-base border flex items-center shrink-0 -ml-1px"
      )}
    >
      <img className="h-6 w-6 mr-2 hidden md:block" src={`/images/icons/leaf.webp`} />
      Carbs Per Cal
    </button>
    <button
      value="lowSodium"
      key="lowSodium"
      onClick={handleThematicFilter}
      className={classNames(
        thematicFilter == "lowSodium"
        ? "text-red-600 bg-stone-100 shadow-inner font-medium"
          : " text-stone-700 hover:text-stone-900 hover:bg-stone-100 ",
        "whitespace-nowrap py-2 px-3 text-sm md:text-base border flex items-center shrink-0 -ml-1px"
      )}
    >
      <img
        className="h-6 w-6 mr-2 hidden md:block"
        src={`/images/icons/sodium.webp`}
      />
      Sodium Per Cal
    </button>
    <button
     value="lowCholesterol"
      key="lowCholesterol"
      onClick={handleThematicFilter}
      className={classNames(
        thematicFilter == "lowCholesterol"
        ? "text-red-600 bg-stone-100 shadow-inner font-medium "
          : " text-stone-700 hover:text-stone-900 hover:bg-stone-100 ",
        "whitespace-nowrap py-2 px-3 rounded-r-lg text-sm md:text-base border flex items-center shrink-0 -ml-1px"
      )}
    >
      <img className="h-6 w-6 mr-2 hidden md:block" src={`/images/icons/heart.webp`} />
      Cholesterol Per Cal
    </button> */}
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
