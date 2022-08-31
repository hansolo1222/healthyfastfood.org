import { ChevronDownIcon } from "@heroicons/react/outline";
import { FilterThematicFilter } from "./FilterThematicFilter";
import { MobileSectionCalorieFilter } from "./AsideFilterByCalories";
import { Slider } from "@mui/material";

export const RestaurantSectionMobileFilter = ({
  showCalorieFilter,
  setShowCalorieFilter,

  setMinCalories,
  setMaxCalories,

  displayMinCalories,
  displayMaxCalories,
  setDisplayMinCalories,
  setDisplayMaxCalories,

  caloriePreset,
  setCaloriePreset,
  caloriesMessage,
  setCaloriesMessage,

  thematicFilter,
  setThematicFilter,
  setShowCustomRow,

  netCarbLimit,
  netCarbMax,
  handleNetCarbLimitChange,
  marks,

  scrollRef
}) => {
  const openCalorieFilter = () => {
    document.body.style.overflow = "hidden";
    setShowCalorieFilter(true);
    scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });

  };

  const closeCalorieFilter = () => {
    document.body.style.overflow = "auto";
    setShowCalorieFilter(false);
  };

  const handleResetCalorieFilter = () => {
    setCaloriePreset({ name: null });
    setDisplayMinCalories(null);
    setDisplayMaxCalories(null);
    setMinCalories(0);
    setMaxCalories(5000);
    closeCalorieFilter();
  };

  return (
    <section 
      className={`md:hidden sticky top-0 bg-white z-40 border-b border-stone-300`}
    >
      <div className="mobile-padding" >
        <div
          className={`${
            !showCalorieFilter && "border-b"
          } pt-2 pb-2 flex justify-between h-auto`}
        >
          <div className="flex items-center space-x-4 ">
            <button
              onClick={
                !showCalorieFilter ? openCalorieFilter : closeCalorieFilter
              }
              className={`text-base font-semibold  peer py-1 flex items-center ${
                showCalorieFilter ||
                caloriePreset.name ||
                displayMaxCalories ||
                displayMinCalories
                  ? "text-red-600"
                  : "text-stone-700"
              } `}
            >
              Calories{" "}
              <ChevronDownIcon
                className={` ml-1 h-3 w-3  ${
                  showCalorieFilter ? "text-red-500" : "text-stone-500"
                } `}
                aria-hidden="true"
              />
            </button>

            {/* <button
                      onClick={() => setShowCalorieFilter(!showCalorieFilter)}
                      className="text-sm text-stone-700 peer py-1 flex items-center"
                    >
                      Allergens{" "}
                      <ChevronDownIcon
                        className=" ml-1 h-3 w-3 text-stone-500 "
                        aria-hidden="true"
                      />
                    </button> */}
          </div>

          {/* <button
            // onClick={() => setShowCalorieFilter(!showCalorieFilter)}
            onClick={() => setShowCalorieFilter(!showCalorieFilter)}
            className="text-sm text-stone-700 peer py-1 flex items-center"
          >
            Filters{" "}
            <ChevronDownIcon
              className=" ml-1 h-3 w-3 text-stone-500 "
              aria-hidden="true"
            />
          </button> */}
        </div>

        {!showCalorieFilter ? (
          <FilterThematicFilter
            thematicFilter={thematicFilter}
            setThematicFilter={setThematicFilter}
            setShowCustomRow={setShowCustomRow}
          />
        ) : (
          <div className="flex justify-between py-2 border-b h-12 z-20">
            <div className="text-lg">Calories</div>
            <button
              onClick={handleResetCalorieFilter}
              className="text-blue-600 uppercase font-semibold"
            >
              Reset
            </button>
          </div>
        )}
      </div>
      {netCarbLimit && (
        <div className="md:hidden sticky top-0 bg-white z-40 pb-2 border-b mobile-padding">
          <div className="pt-2">
            <h3 className="text-xs font-semibold uppercase text-blue-500 pb-2">
              Net Carbohydrate Limit
            </h3>
            <Slider
              aria-label="Net carbohydrate limit"
              defaultValue={netCarbLimit}
              onChange={handleNetCarbLimitChange}
              marks={marks}
              min={0}
              max={netCarbMax}
              valueLabelDisplay="auto"
            />
          </div>
        </div>
      )}

      <MobileSectionCalorieFilter
        showCalorieFilter={showCalorieFilter}
        closeCalorieFilter={closeCalorieFilter}
        setMinCalories={setMinCalories}
        setMaxCalories={setMaxCalories}
        displayMinCalories={displayMinCalories}
        displayMaxCalories={displayMaxCalories}
        setDisplayMinCalories={setDisplayMinCalories}
        setDisplayMaxCalories={setDisplayMaxCalories}
        caloriesMessage={caloriesMessage}
        setCaloriesMessage={setCaloriesMessage}
        caloriePreset={caloriePreset}
        setCaloriePreset={setCaloriePreset}

      />
    </section>
  );
};
