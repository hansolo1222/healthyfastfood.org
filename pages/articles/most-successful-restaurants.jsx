import React, { PureComponent } from "react";
const restaurants = require("/public/restaurantData/tope.json");
import _ from "lodash";
var randomHexColor = require("random-hex-color");
import ReactMarkdown from "react-markdown";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  LogarithmicScale,
} from "chart.js";
import { Scatter, Bubble } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import Layout from "../../components/Layout";

console.log(restaurants);

const colorMap = {
  Hamburgers: "#dc2626 ",
  "Pizza/Italian": "#FD971F ",
  Beverages: "#fca5a5  ",
  Chicken: "#facc15 ",
  Sandwiches: "#a16207 ",
  "Mexican/Tex-Mex": "#a5b4fc  ",
  Asian: "#d946ef ",
  "Frozen Desserts": "#059669  ",
  Salad: "#1c1917 ",
  American: "#3b82f6 ",
  Steakhouse: "#6d28d9 ",
  "Breakfast/Baked Goods": "#d1d5db",
  "Baked Goods": "#FFF500",
  Seafood: "#84cc16 ",
};
const grouped = _.groupBy(
  restaurants.map((r) => ({
    ...r,
    x: r.locations,
    y: r.salesMillions,
    r: Math.sqrt(r.revenuePerStore / Math.PI) * 8,
  })),
  (restaurant) => restaurant.type
);

console.log(grouped);
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  LogarithmicScale
);

const footer = (tooltipItems) => {
  console.log(tooltipItems)
  let sum = 0;

  tooltipItems.forEach(function(tooltipItem) {
    tooltipItem.parsed.y;
  });

  const labelText = 
`Locations: ${tooltipItems[0].raw.x} 
Revenue: $${tooltipItems[0].raw.y} million
Sales per Location: $${tooltipItems[0].raw.revenuePerStore.toFixed(2)} mil`
  return labelText;
};

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "Sales and Locations",
    },
    tooltip: {
      callbacks: {
        label: function(tooltipItem, data) {
          return tooltipItem.raw.name;
        },
        footer: footer,
      },
      bodyFont: {
        weight: 700,
        size: 14,
        color: "#000"
      },
     
      footerFont: {
        weight: 400,
        color: "#000"

      },
      borderWidth: 1,
      borderColor: "#111",
      bodyColor: "#000",
      footerColor: "#000",
      backgroundColor: '#FFF',
      padding: 10
//       bodyFontColor: '#000000',
//       backgroundColor: '#FFF',
// footerFontColor: '#000000',

//       // titleFontSize: 16,
//       titleFontColor: '#0066ff',
      
//       // bodyFontSize: 14,
    }
  },

  animations: {
    tension: {
      duration: 1000,
      easing: "linear",
      from: 1,
      to: 0,
      loop: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      type: "logarithmic",
      title: {
        display: true,
        text: "2021 Sales (Millions)",
        font: {
          size: 20,
        },
      },
      grid: {
        color: "#eee",
      },
    },
    x: {
      beginAtZero: true,
      type: "logarithmic",
      title: {
        display: true,
        text: "Number of Locations",
        font: {
          size: 20,
        },
      },
      grid: {
        color: "#eee",
      },
    },
  },
};

// 4168	1578
// 2418	664
// 2293	207
// 1169	392
// 1087	212
// 835	303

const fullData = {
  burger: [
    { x: 4168, y: 1578, z: 1 },
    { x: 2418, y: 664, z: 2 },
    { x: 2293, y: 207 },
  ],
  pizza: [{ x: 418, y: 158, z: 1 }],
};

const datasets = [];

Object.keys(grouped).forEach((key) => {
  datasets.push({
    label: key,
    data: grouped[key],
    backgroundColor: colorMap[key],
    borderWidth: 0,
    pointRadius: 4,
  });
});

export const data = {
  datasets: datasets,

  // [
  //   {
  //     label: 'Burger',
  //     data: grouped["Hamburgers"],
  //     backgroundColor: '#CF2A37',
  //     borderWidth: 0,
  //     pointRadius: 4,
  //   },
  //   {
  //     label: 'Pizza',
  //     data: fullData.pizza,
  //     pointBackgroundColor: '#FF9100',
  //     backgroundColor: '#FF9100',
  //     borderWidth: 0,
  //     pointRadius: 4,
  //   },
  // ],
};

export default function App() {
  return (
    <Layout>
    <div className="prose-sm md:prose-base mobile-padding">
      <div className="mx-auto max-w-prose prose my-10">
        <ReactMarkdown>
          {`
# Comparing the 200 Most Successful Restaurant Chains in the US

SEPTEMBER 13, 2022

See how the most successful restaurants compare in terms of sales revenue (data for 2021) and number of locations. The size of the dot represents revenue per store in millions. More [details on the biggest restaurant chains in the US](#evaluate) »

`}
        </ReactMarkdown>
      </div>
      <div style={{height: '600px'}}>

      <Bubble options={options} data={data} />
</div>
      <div className="mx-auto max-w-prose prose my-10">
        <h2 id="evaluate">How do you evaluate success?</h2>

        <ReactMarkdown>
          {`


If **success means sales**, [McDonald’s](/mcdonalds) is the winner by a mile. The fast food chain earned $45,961 million in 2021, followed by [Starbucks](/starbucks) ($24,556 million), then [Chick-fil-A](/chick-fil-a) ($16,674 million), [Taco Bell](taco-bell) ($12,615 million) and [Wendy’s](wendys) ($11,111 million).

What about total **number of locations**? Location count can give a rough estimate of success, however it does have limitations. [Subway](/subway) has the most locations of any restaurant chain in the world (21,147 in the US alone, 37,540 locations globally), but this can be attributed to its low franchising fees and the fact that stores can be opened right next to other without restriction. The result is excessive locations that [cannabalize each other's sales.](https://www.businessinsider.com/subway-franchise-model-forces-locations-to-close-2019-9).

In this report we **compare a restaurant sales revenue from 2021 to its location count** (US only, revenue and locations outside the US have been excluded) to paint a multidimensional portrait of restaurant success. Both axes are plotted using a logarithmic scale to give a clearer picture of this winner-takes-all space.

The general trend is obvious: the more locations a restaurant has, the more revenue it generates.

More interesting is that we've used dot size to indicate "Revenue per Store". This gives us insight into the restaurants and restaurant types that earn the most per location.

**Highlights:**
- The restaurant chain with the highest revenue per store? **[STK Steakhouse](/stk-steakhouse)**, a high end steakhouse located in major cities. It has 14 locations and earned 200 million in 2021. A 10oz Rib Eye from the STK menu costs $78.00.

- #2 is [Ocean Prime](/ocean-prime), a seafood and steak restaurant with 17 locations and 204 million in 2021 sales.

- The Revenue per Store heavy hitters are [Steakhouses](/restaurants/steakhouses) (purple) and [American restaurants](/restaurants/american) (Blue)**. This makes sense as many chains in these categories are known as "fine dining" establishment with high average costs per meal and high profit margins.

- **Subway** has been criticized for the past 20 years for encouraging franchisees to open a high number of locations. On the chart above it's clear that Subway has the most locations but has stunningly low revenue per location compared to top chains.

- In the top 10 restaurants by total revenue, [Chick-Fil-A](/chick-fil-a) earns the most per store (6.17 million avg per store) followed by [McDonald's](/mcdonalds) (3.42 million) and [Chipotle](/chipotle) (2.55 million).

- The only 2 restaurants in the top 200 that focus on **salads** are [Sweetgreen](/sweetgreen) (2.27 million per store) and [CAVA](/cava) (1.15 million per store).


`}
        </ReactMarkdown>
      </div>
      </div>
    </Layout>
  );
}
