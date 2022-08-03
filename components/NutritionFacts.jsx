import React from 'react';

function formatAsPercent(num) {
    return Number(num).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:0}); 
  }

const NutritionFacts = ({data}) => {
    console.log(data,"this")
  return (
    <section className="performance-facts border  w-full mr-5 p-6 rounded-lg text-stone-900">
      <header className="performance-facts__header m-0 pb-1">
        <h2 className="performance-facts__title text-3xl leading-none m-0 p-0 font-black">Nutrition Facts</h2>
        <p className="leading-extratight text-sm">{data.name}</p>
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
              <th colSpan="1">
                <span className="font-black">Calories </span>
                {data.calories}
              </th>
              <td colSpan="1">

              <span className="">Calories from Fat </span>
                {data.totalFat*9}
              
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
              <span className="font-black">Total Fat </span>
              {data.totalFat}g
              </th>
              <td>
              <span className="font-black">{formatAsPercent(data.totalFat/78)}</span>
              </td>
            </tr>
            <tr>
              <td className="blank-cell">
              </td>
              <th>
                <span>Saturated Fat </span>
                {data.saturatedFat}g
              </th>
              <td>
                <b>{formatAsPercent(data.saturatedFat/20)}</b>
              </td>
            </tr>
            <tr>
              <td className="blank-cell">
              </td>
              <th>
                <span>Trans Fat </span>
                {data.transFat}g
              </th>
              <td>
              </td>
            </tr>
            <tr>
              <th colSpan="2">
              <span className="font-black">Cholesterol </span>
              {data.cholesterol}mg
            </th>
            <td>
            <span className="font-black">{formatAsPercent(data.cholesterol/300)}</span>
              </td>
            </tr>
            <tr>
              <th colSpan="2">
                <span className="font-black">Sodium </span>
                {data.sodium}mg
              </th>
              <td>
              <span className="font-black">{formatAsPercent(data.sodium/2300)}</span>
              </td>
            </tr>
            <tr>
              <th colSpan="2">
              <span className="font-black">Total Carbs </span>
                {data.totalCarbohydrates}g
              </th>
              <td>
              <span className="font-black">{formatAsPercent(data.totalCarbohydrates/275)}</span>
              </td>
            </tr>
            <tr>
              <td className="blank-cell">
              </td>
              <th>
                <span>Dietary Fiber </span>
                {data.dietaryFiber}g
             </th>
              <td>
                <b>{formatAsPercent(data.dietaryFiber/28)}</b>
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
              <span className="font-black">Protein </span>
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
              <td className="w-1/3">
                <span>Vitamin A </span>
                {data.vitaminA}%
              </td>
              <td className="text-center w-1/3">•</td>
              <td className="w-1/3">
              <span>Vitamin C </span>
                {data.vitaminC}%
              </td>
            </tr>
            <tr className="thin-end">
              <td colSpan="">
                <span>Calcium </span>
                {data.calcium}%
              </td>
              <td className="text-center">•</td>
              <td className="">
                <span>Iron </span>
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