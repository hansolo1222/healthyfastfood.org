import Image from "next/image";
import { Transition } from "@headlessui/react";
import { classNames } from "./utils";

const calorieFilters = [
  {
    min: 0,
    max: 200,
    name: "0-200",
    label: "0-200 calories",
  },
  {
    min: 200,
    max: 400,
    name: "200-400",
    label: "200-400 calories",
  },
  {
    min: 400,
    max: 600,
    name: "400-600",
    label: "400-600 calories",
  },
  {
    min: 600,
    max: 800,
    name: "600-800",
    label: "600-800 calories",
  },
  {
    min: 800,
    max: 10000,
    name: "800+",
    label: "800+ calories",
  },
];

export const AsideCalorieFilter = ({
  setMinCalories,
  setMaxCalories,
  
  caloriesMessage,
  setCaloriesMessage,
  caloriePreset,
  setCaloriePreset,

  displayMinCalories,
  displayMaxCalories,
  setDisplayMinCalories,
  setDisplayMaxCalories
  
}) => {

//input handlers for desktop and mobile, they both clear the Presets if any
const handleMinCalorieInput = (event) => {
  setCaloriePreset({ name: null });
  setDisplayMinCalories(event.target.valueAsNumber);
};

const handleMaxCalorieInput = (event) => {
  setCaloriePreset({ name: null });
  setDisplayMaxCalories(event.target.valueAsNumber);
};

// On desktop, selecting a preset actually runs the filters. It also fills the inputs
const handleCaloriePreset = (event, min, max) => {
  setCaloriePreset({ name: event.target.value, min: min, max: max });
  setMinCalories(min);
  setMaxCalories(max);
  setDisplayMinCalories(min);
  setDisplayMaxCalories(max);
};

// CTA filter
  const handleCalorieFilterSubmit = (event) => {
    event.preventDefault();
    if (displayMinCalories == null && displayMaxCalories == null) {
      setCaloriesMessage("Please specify a calorie limit");
    } else {
      setCaloriesMessage("");
      setCaloriePreset({ name: null });
      if (
        displayMinCalories &&
        displayMaxCalories &&
        displayMinCalories > displayMaxCalories
      ) {
        const tempMin = displayMaxCalories;
        const tempMax = displayMinCalories;
        setDisplayMinCalories(tempMin);
        setDisplayMaxCalories(tempMax);
        setMinCalories(tempMin);
        setMaxCalories(tempMax);
      } else {
        // console.log(displayMinCalories,displayMaxCalories)
        isNaN(displayMinCalories) && setMinCalories(0);
        isNaN(displayMaxCalories) && setMaxCalories(10000);
  
        !isNaN(displayMinCalories) && setMinCalories(displayMinCalories);
        !isNaN(displayMaxCalories) && setMaxCalories(displayMaxCalories);
      }
    }
  };

  return (
    <section className="mt-8 ">
      <h3 className="text-stone-900 text-sm font-bold pb-2">Calorie Limits</h3>

      <div className=" text-stone-600 text-sm space-y-1">

      {calorieFilters.map((f, index) => {
                return (
                  <button
                    value={f.name}
                    key={f.name}
                    onClick={(e) => handleCaloriePreset(e, f.min, f.max)}
                    className="hover:text-orange-500"
                  >
                    {f.label}
                  </button>
                );
              })}

      </div>
      <form onSubmit={handleCalorieFilterSubmit}>
        <div className="flex justify-start my-4 gap-1">
          <input
            id="min-cal"
            value={displayMinCalories}
            onChange={handleMinCalorieInput}
            name="min-calories"
            type="number"
            className="appearance-none min-w-0 bg-white border w-32 rounded-sm py-1 px-2 text-sm text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-500 focus:ring-white focus:border-white focus:placeholder-stone-400"
            placeholder="Min"
          />
          <input
            id="max-cal"
            value={displayMaxCalories!== 10000 ? displayMaxCalories : ""}
            onChange={handleMaxCalorieInput}
            name="max-calories"
            type="number"
            className="appearance-none min-w-0 bg-white border w-32 rounded-sm py-1 px-2 text-sm text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-500 focus:ring-white focus:border-white focus:placeholder-stone-400"
            placeholder="Max"
          />
          <button
            type="submit"
            className="w-20 shadow-sm border text-sm font-medium rounded-lg text-stone-900 "
          >
            Go
          </button>
        </div>
        {caloriesMessage ? (
                <div className="mb-2 text-sm text-red-500">
                  {caloriesMessage}
                </div>
              ) : (
                ``
              )}
      </form>
    </section>
  );
};

export const MobileSectionCalorieFilter = ({
  showCalorieFilter,
  closeCalorieFilter,

  setMinCalories,
  setMaxCalories,

  displayMinCalories,
  displayMaxCalories,
  setDisplayMinCalories,
  setDisplayMaxCalories,

  caloriesMessage,
  setCaloriesMessage,
  caloriePreset,
  setCaloriePreset
  
}) => {



//input handlers for desktop and mobile, they both clear the Presets if any
const handleMinCalorieInput = (event) => {
  setCaloriePreset({ name: null });
  setDisplayMinCalories(event.target.valueAsNumber);
};

const handleMaxCalorieInput = (event) => {
  setCaloriePreset({ name: null });
  setDisplayMaxCalories(event.target.valueAsNumber);
};

// On mobile, select preset
const handleMobileCaloriePreset = (event, min, max) => {
  setDisplayMinCalories(min);
  setDisplayMaxCalories(max);
  setCaloriePreset({ name: event.target.value, min: min, max: max });
};

// Mobile CTA filter
const handleMobileCalorieFilterSubmit = (event) => {
  event.preventDefault();
  if (
    caloriePreset.name == null &&
    displayMinCalories == null &&
    displayMaxCalories == null
  ) {
    setCaloriesMessage("Please specify a calorie limit");
  } else {
    setCaloriesMessage("");
    if (
      displayMinCalories &&
      displayMaxCalories &&
      displayMinCalories > displayMaxCalories
    ) {
      const tempMin = displayMaxCalories;
      const tempMax = displayMinCalories;
      setDisplayMinCalories(tempMin);
      setDisplayMaxCalories(tempMax);
    }
    if (caloriePreset.name !== null) {
      setMinCalories(caloriePreset.min);
      setMaxCalories(caloriePreset.max);
    } else {
      // console.log("fired", displayMinCalories, displayMaxCalories)

      isNaN(displayMinCalories) && setMinCalories(0);
      isNaN(displayMaxCalories) && setMaxCalories(10000);
      !isNaN(displayMinCalories) && setMinCalories(displayMinCalories);
      !isNaN(displayMaxCalories) && setMaxCalories(displayMaxCalories);
    }
    closeCalorieFilter();
  }
};


  return (
    <Transition appear show={showCalorieFilter} >
      <Transition.Child
        
        enter="ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-100"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div
          className={`absolute left-0 bottom-0 w-full h-0 before:bg-black/20 mobile-filter-popup ${
            showCalorieFilter ? "active block " : "hidden"
          }`}
        >
          <div className="bg-white rounded-b-xl z-50 absolute top-0 w-full mobile-padding pb-4">
            <div className="inline-flex flex-wrap pt-4">
              {calorieFilters.map((f, index) => {
                return (
                  <button
                    value={f.name}
                    key={f.name}
                    onClick={(e) => handleMobileCaloriePreset(e, f.min, f.max)}
                    className={classNames(
                      caloriePreset.name == f.name
                        ? " bg-white text-orange-600 border-orange-600"
                        : " bg-stone-100 text-stone-600 hover:bg-stone-100 border-transparent",
                      "border rounded-full whitespace-nowrap py-1 px-2 text-sm md:text-base  flex items-center shrink-0 mb-2 mr-2"
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleMobileCalorieFilterSubmit}>
              <div className="flex justify-between mt-2 mb-4">
                <input
                  id="min-cal"
                  value={displayMinCalories}
                  onChange={handleMinCalorieInput}
                  name="min-calories"
                  type="number"
                  className="appearance-none min-w-0 w-full bg-white border rounded-md py-1 px-2 text-base text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-500 focus:ring-white focus:border-white focus:placeholder-stone-400"
                  placeholder="Min calories"
                />
                <div className="mx-4 mt-2.5 text-sm">to</div>
                <input
                  id="max-cal"
                  value={displayMaxCalories}
                  onChange={handleMaxCalorieInput}
                  name="max-calories"
                  type="number"
                  className="appearance-none min-w-0 w-full bg-white border rounded-md py-2 px-2 text-base text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-500 focus:ring-white focus:border-white focus:placeholder-stone-400"
                  placeholder="Max calories"
                />
              </div>
              {caloriesMessage ? (
                <div className="mb-2 text-sm text-red-500">
                  {caloriesMessage}
                </div>
              ) : (
                ``
              )}
              <button
                type="submit"
                className="w-full bg-red-500 py-2 font-medium text-lg rounded-lg text-white"
              >
                Apply Filter
              </button>
            </form>
          </div>

          <div
            className="absolute top-0 left-0 w-full h-screen"
            onClick={closeCalorieFilter}
          />
        </div>
      </Transition.Child>
    </Transition>
  );
};
