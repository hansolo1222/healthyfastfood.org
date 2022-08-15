import Image from "next/image";

export const AsideFilterByCalories = ({ handleSetMaxCalories, handleSetMinCalories }) => {
  return (
    <section className="mt-8 ">
    <h3 className="text-stone-900 text-sm font-bold pb-2">
      Calorie Limits
    </h3>

    <div className=" text-stone-600 text-sm space-y-1">
      <button
        className="block hover:text-orange-500"
        value={100}
        onClick={handleSetMaxCalories}
      >
        Up to 100 cal{" "}
      </button>
      <button
        className="block  hover:text-orange-500"
        value={300}
        onClick={handleSetMaxCalories}
      >
        Up to 300 cal
      </button>
      <button
        className="block  hover:text-orange-500"
        value={500}
        onClick={handleSetMaxCalories}
      >
        Up to 500 cal
      </button>
      <button
        className="block  hover:text-orange-500"
        value={800}
        onClick={handleSetMaxCalories}
      >
        Up to 800 cal
      </button>
      <button
        className="block  hover:text-orange-500"
        value={800}
        onClick={handleSetMinCalories}
      >
        800 cal & above
      </button>
    </div>
  </section>
  );
};
