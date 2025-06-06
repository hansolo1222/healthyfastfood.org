import { PieChart } from "react-minimal-pie-chart";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import NutritionFacts from "./NutritionFacts";
ChartJS.register(ArcElement, Tooltip, Legend);

export const SectionNutritionSummary = ({ meal }) => {
  const data = {
    labels: ["Carbohydrates", "Protein", "Fat"],
    datasets: [
      {
        label: "Macro Breakdown",
        data: [
          meal.totalCarbohydrates * 4,
          meal.protein * 4,
          meal.totalFat * 9,
        ],
        backgroundColor: ["#E38627", "#6A2135", "#C13C37"],
        hoverOffset: 4,
      },
    ],
    legend: {
      position: "bottom",
    },
    responsive: true,
    options: {
      title: {
        display: true,
        text: "Macro nutrient breakdown",
      },
    },
  };
  return (
    <section>
      <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-8 mt-8" id="nutrition-information">
        <div className="col-span-1">
          <NutritionFacts data={meal} />
        </div>

        <div className="col-span-1">
          <div className="border p-5 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Macros Summary</h2>

            <Pie data={data} />
            <p className="text-sm text-stone-600 mt-8">
              {" "}
              The acceptable macronutrient distribution ranges (AMDR) are 45–65%
              of your daily calories from carbs, 20–35% from fats and 10–35%
              from protein.
            </p>
          </div>
        </div>
      {meal.calories > 0 &&
        <div className="col-span-1">
          <div className="border p-5 rounded-lg">
          <h3 className="pb-4 font-semibold">How much exercise would it take to burn off the {meal.name}?</h3>

          <p>For someone weighing 150 pounds, it would take {(meal.calories * 60 / 700).toFixed(0)} minutes to burn off the {meal.name} by running.</p>
          <br/>
          <p>It would take {(meal.calories * 30 / 252).toFixed(0)} minutes to burn if off by bicycling.</p>
          <br/>
          <p>It would take {(meal.calories * 30 / 216).toFixed(0)} minutes to burn if off by weightlifting.</p>
          </div>
        </div>
      }
      </div>
    </section>
  );
};
