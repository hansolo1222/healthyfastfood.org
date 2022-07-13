import React from 'react';

const NutritionFacts = ({data}) => {
    console.log(data,"this")
  return (
    <section classNameName="performance-facts border bg-white shadow-lg w-full mr-5 p-5 rounded-lg">
      <header classNameName="performance-facts__header m-0 pb-1">
        <h1 classNameName="performance-facts__title text-3xl leading-none m-0 p-0">Nutrition Facts</h1>
        <p classNameName="leading-extratight text-sm">Serving Size 1 Burger</p>
      </header>
      <table className="performance-facts__table">
        <thead>
          <tr>
            <th colSpan="3" className="small-info text-xs">
              Amount Per Serving
            </th>
          </tr>
        </thead>
        <tbody>
            <tr>
              <th colSpan="2">
                <span classNameName="font-black">Calories </span>
                {data.calories}
              </th>
              <td>
                Calories from Fat
                111
              </td>
            </tr>
            <tr className="thick-row">
              <td colSpan="3" className="small-info text-xs">
                % Daily Value*
              </td>
            </tr>
      </tbody>
    </table>
      <table className="performance-facts__table">
          <tbody>
            <tr>
              <th colSpan="2">
              <span classNameName="font-black">Total Fat </span>
              {data.total_fat}g
              </th>
              <td>
              <span classNameName="font-black">22%</span>
              </td>
            </tr>
            <tr>
              <td className="blank-cell">
              </td>
              <th>
                <span>Saturated Fat </span>
                {data.saturated_fat}g
              </th>
              <td>
                <b>22%</b>
              </td>
            </tr>
            <tr>
              <td className="blank-cell">
              </td>
              <th>
                <span>Trans Fat </span>
                {data.trans_fat}g
              </th>
              <td>
              </td>
            </tr>
            <tr>
              <th colSpan="2">
              <span classNameName="font-black">Cholesterol </span>
              {data.cholesterol}mg
            </th>
            <td>
            <span classNameName="font-black">18%</span>
              </td>
            </tr>
            <tr>
              <th colSpan="2">
                <span classNameName="font-black">Sodium </span>
                {data.sodium}mg
              </th>
              <td>
              <span classNameName="font-black">2%</span>
              </td>
            </tr>
            <tr>
              <th colSpan="2">
              <span classNameName="font-black">Total Carbs </span>
                {data.total_carbohydrates}g
              </th>
              <td>
              <span classNameName="font-black">6%</span>
              </td>
            </tr>
            <tr>
              <td className="blank-cell">
              </td>
              <th>
                <span>Dietary Fiber </span>
                {data.dietary_fiber}g
             </th>
              <td>
                <b>4%</b>
              </td>
            </tr>
            <tr>
              <td className="blank-cell">
              </td>
              <th>
                <span>Sugars </span>
                {data.sugar}g
              </th>
              <td>
              </td>
            </tr>
            <tr className="thick-end">
              <th colSpan="2">
              <span classNameName="font-black">Protein </span>
              {data.protein}g
            </th>
              <td>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="performance-facts__table performance-facts__table--dots">
          <tbody>
            <tr>
              <td classNameName="w-1/3">
                Vitamin A
                {data.vitamin_a}%
              </td>
              <td classNameName="text-center w-1/3">•</td>
              <td classNameName="w-1/3">
                Vitamin C
                {data.vitamin_c}%
              </td>
            </tr>
            <tr className="thin-end">
              <td colSpan="">
                Calcium
                {data.calcium}%
              </td>
              <td classNameName="text-center">•</td>
              <td classNameName="">
                Iron
                {data.iron}%
              </td>
            </tr>
          </tbody>
        </table>

        <p className="text-xs leading-extratight pt-1">* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs:</p>
{/* 
        <table className="performance-facts__table--small small-info">
          <thead>
            <tr>
              <td colSpan="2"></td>
              <th>Calories:</th>
              <th>2,000</th>
              <th>2,500</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colSpan="2">Total Fat</th>
              <td>Less than</td>
              <td>65g</td>
              <td>80g</td>
            </tr>
            <tr>
              <td className="blank-cell"></td>
              <th>Saturated Fat</th>
              <td>Less than</td>
              <td>20g</td>
              <td>25g</td>
            </tr>
            <tr>
              <th colSpan="2">Cholesterol</th>
              <td>Less than</td>
              <td>300mg</td>
              <td>300 mg</td>
            </tr>
            <tr>
              <th colSpan="2">Sodium</th>
              <td>Less than</td>
              <td>2,400mg</td>
              <td>2,400mg</td>
            </tr>
            <tr>
              <th colSpan="3">Total Carbohydrate</th>
              <td>300g</td>
              <td>375g</td>
            </tr>
            <tr>
              <td className="blank-cell"></td>
              <th colSpan="2">Dietary Fiber</th>
              <td>25g</td>
              <td>30g</td>
            </tr>
          </tbody>
        </table>
        <p className="small-info">
          Calories per gram:
  </p>
        <p className="small-info text-center">
          Fat 9
          &bull;
          Carbohydrate 4
          &bull;
          Protein 4
  </p> */}
  
</section>
  );
}

export default NutritionFacts;