
export const AsideAllergens = ({ allergens, setAllergens, handleAllergens }) => {
  return (
    <section className="mt-6">
              <h3 className="text-stone-900 text-sm font-bold">
                Allergens
              </h3>

              <div className="pt-2 ">
                <div className="inline-block mb-1 mr-1" key="gluten">
                  <input
                    id="gluten"
                    name="allergens"
                    className="button-checkbox"
                    type="checkbox"
                    checked={allergens.includes("gluten")}
                    onChange={(e) => handleAllergens(e,allergens,setAllergens)}
                  />
                  <label
                    htmlFor="gluten"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm hover:bg-stone-200 hover:text-stone-700"
                  >
                    Gluten Free
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1" key="milk">
                  <input
                    className="button-checkbox"
                    id="milk"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("milk")}
                    onChange={(e) => handleAllergens(e,allergens,setAllergens)}
                  />
                  <label
                    htmlFor="milk"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm hover:bg-stone-200 hover:text-stone-700"
                  >
                    Dairy Free
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1">
                  <input
                   className="button-checkbox"
                    id="peanuts"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("peanuts")}
                    onChange={(e) => handleAllergens(e,allergens,setAllergens)}
                  />
                  <label
                    htmlFor="peanuts"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm hover:bg-stone-200 hover:text-stone-700"
                  >
                    No Peanuts
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1">
                  <input
                   className="button-checkbox"
                    id="eggs"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("eggs")}
                    onChange={(e) => handleAllergens(e,allergens,setAllergens)}
                  />
                  <label
                    htmlFor="eggs"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm hover:bg-stone-200 hover:text-stone-700"
                  >
                    No Eggs
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1">
                  <input
                   className="button-checkbox"
                    id="wheat"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("wheat")}
                    onChange={(e) => handleAllergens(e,allergens,setAllergens)}
                  />
                  <label
                    htmlFor="wheat"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm  hover:bg-stone-200 hover:text-stone-700"
                  >
                    No Wheat
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1">
                  <input
                   className="button-checkbox"
                    id="soy"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("soy")}
                    onChange={(e) => handleAllergens(e,allergens,setAllergens)}
                  />
                  <label
                    htmlFor="soy"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm  hover:bg-stone-200 hover:text-stone-700"
                  >
                    No Soy
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1">
                  <input
                   className="button-checkbox"
                    id="tree nuts"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("tree nuts")}
                    onChange={(e) => handleAllergens(e,allergens,setAllergens)}
                  />
                  <label
                    htmlFor="tree nuts"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm  hover:bg-stone-200 hover:text-stone-700"
                  >
                    No Tree Nuts
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1">
                  <input
                   className="button-checkbox"
                    id="fish"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("fish")}
                    onChange={(e) => handleAllergens(e,allergens,setAllergens)}
                  />
                  <label
                    htmlFor="fish"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm  hover:bg-stone-200 hover:text-stone-700"
                  >
                    No Fish
                  </label>
                </div>
                <div className="inline-block mb-1 mr-1">
                  <input
                   className="button-checkbox"
                    id="shellfish"
                    name="allergens"
                    type="checkbox"
                    checked={allergens.includes("shellfish")}
                    onChange={(e) => handleAllergens(e,allergens,setAllergens)}
                  />
                  <label
                    htmlFor="shellfish"
                    className="special-input cursor-pointer inline-flex whitespace-nowrap items-center px-2 py-0.5 rounded-lg text-sm  hover:bg-stone-200 hover:text-stone-700"
                  >
                    No Shellfish
                  </label>
                </div>
              </div>
            </section>
  );
};
