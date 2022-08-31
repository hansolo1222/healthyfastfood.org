


export const AsideFilterByUmbrellaCategories = ({ umbrellaCategories, setUmbrellaCategories }) => {
  const handleUmbrellaCategories = (e) => {
    let filter = e.target.id;
    umbrellaCategories.includes(filter)
      ? setUmbrellaCategories(
          umbrellaCategories.filter((value) => value !== filter)
        )
      : setUmbrellaCategories(umbrellaCategories.concat(filter));
  };
  
  return ( 
    <section className="mt-6">
              <h3 className="text-stone-900 text-sm font-bold pb-2">
                Type
              </h3>
              <div className="flex items-center mb-1 " >  
              <input
                  className="w-4 h-4 text-orange-600 bg-gray-100 rounded border-gray-300 cursor-pointer"
                  id="food"
                  value="food"
                  name="umbrellaCategories"
                  type="checkbox"
                  checked={umbrellaCategories.includes("food")}
                  onChange={(e) => handleUmbrellaCategories(e)}
                />
                <label
                  htmlFor="food"
                  className="special-input cursor-pointer inline-flex whitespace-nowrap items-center pl-2 text-sm"
                >
                  Food
               </label>
               </div>
               <div className="flex items-center mb-1" >
               <input
                  className="w-4 h-4 text-orange-600 bg-gray-100 rounded border-gray-300 cursor-pointer"
                  id="beverages"
                  value="beverages"
                  name="umbrellaCategories"
                  type="checkbox"
                  checked={umbrellaCategories.includes("beverages")}
                  onChange={(e) => handleUmbrellaCategories(e)}
                />
                 <label
                    htmlFor="beverages"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center pl-2 text-sm"
                  >
                    Beverage
               </label>
               </div>
               <div className="flex items-center mb-1 " >
               <input
                  className="w-4 h-4 text-orange-600 bg-gray-100 rounded border-gray-300 cursor-pointer"
                  id="condiments"
                  value="condiments"
                  name="umbrellaCategories"
                  type="checkbox"
                  checked={umbrellaCategories.includes("condiments")}
                  onChange={(e) => handleUmbrellaCategories(e)}
                />
                 <label
                    htmlFor="condiments"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center pl-2 text-sm"
                  >
                    Condiments & Dressings
               </label>
               </div>

              {/* 

<div className="inline-block mb-2" key="all">
        <input
          id="all"
          type="checkbox"
          checked={filters.length == 0}
          onChange={() => setFilters([])}
        />
        <label
          htmlFor="all"
          className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium"
        >
          All
        </label>
      </div>

      {categories.map((category) => {
        return (
          <div className="inline-block  mb-2" key={category}>
            <input
              id={category}
              type="checkbox"
              checked={filters.includes(category)}
              onChange={() => handleFilter(category)}
            />
            <label
              htmlFor={category}
              className="cursor-pointer inline-flex whitespace-nowrap items-center px-3 py-1 rounded-lg text-sm font-medium "
            >
              {formatParentCategory(category, false, true, true)}
            </label>
          </div>
        );
      })} */}
            </section>
  );
};
