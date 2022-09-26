import React, { PureComponent } from "react";
const restaurants = require("/public/restaurantData/tope.json");
import _ from "lodash";
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
// import mcdonalds from '/images/logosSmall/mcdonalds.webp'; // Tell webpack this JS file uses this image

import Image from 'next/image'

console.log(restaurants);

const colorMap = {
  Hamburgers: "#dc2626",
  "Pizza/Italian": "#FD971F",
  Beverages: "#a5b4fc",
  Chicken: "#facc15",
  Sandwiches: "#ECC7B3",
  "Mexican/Tex-Mex": "#059669",
  Asian: "#d946ef ",
  "Frozen Desserts": "#d1d5db",
  Salad: "#84cc16",
  American: "#3b82f6 ",
  Steakhouse: "#a16207 ",
  "Breakfast/Baked Goods": "#1c1917",
  "Baked Goods": "#FFF500",
  Seafood: "#fca5a5",
};
const grouped = _.groupBy(
  restaurants.map((r) => ({
    ...r,
    x: r.locations,
    y: r.revenuePerStore,
    r: Math.sqrt(r.salesMillions / Math.PI)/2.5,
  })),
  (restaurant) => restaurant.type
);

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  LogarithmicScale
);

const footer = (tooltipItems) => {
  let sum = 0;

  tooltipItems.forEach(function(tooltipItem) {
    tooltipItem.parsed.y;
  });

  const labelText = 
`Locations: ${tooltipItems[0].raw.x} 
Revenue Per Store: $${tooltipItems[0].raw.revenuePerStore.toFixed(2)} mil
Total Revenue: $${tooltipItems[0].raw.salesMillions} mil`
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
      
      title: {
        display: true,
        text: "2021 Revenue Per Store (Millions)",
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


const datasets = [];

// const img = new Image();
// img.src = 'https://i.stack.imgur.com/gXQrT.png';

const image = <img src='/images/logosSmall/mcdonalds.webp'/>
// const chartPoint = new Image()
// chartPoint.src = myIcon

const pointStyles = [image, 'triangle', 'circle'];

const plugins = {
  afterUpdate: chart => {
    chart.getDatasetMeta(0).data.forEach((d, i) => d._model.pointStyle = pointStyles[0]);
  }
}


Object.keys(grouped).forEach((key) => {
  // const image = new Image()
  // image.src = '/images/logosSmall/mcdonalds.webp'
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

See how the most successful restaurants compare in terms of revenue per store (data for 2021) and number of locations. The size of the dot represents total 2021 revenue. More [details on the biggest restaurant chains in the US »](#evaluate)

`}
        </ReactMarkdown>
      </div>
      <div style={{height: '600px'}}>

      <Bubble plugins={plugins} options={options} data={data} />
</div>
      <div className="mx-auto max-w-prose prose my-10">
        <h2 id="evaluate">How do you evaluate success?</h2>

        <ReactMarkdown>
          {`


If **success means sales**, [McDonald’s](/mcdonalds) is the winner by a mile. The fast food chain earned $45,961 million in 2021, followed by [Starbucks](/starbucks) ($24,556 million), then [Chick-fil-A](/chick-fil-a) ($16,674 million), [Taco Bell](taco-bell) ($12,615 million) and [Wendy’s](wendys) ($11,111 million).

What about total **number of locations**? Location count can give a rough estimate of success, however it does have limitations. [Subway](/subway) has the most locations of any restaurant chain in the world (21,147 in the US alone, 37,540 locations globally), but this can be attributed to its low franchising fees and the fact that stores can be opened right next to other without restriction. The result is excessive locations that [cannabalize each other's sales.](https://www.businessinsider.com/subway-franchise-model-forces-locations-to-close-2019-9).

In this report we **compare a restaurant sales revenue from 2021 to its location count** (US only, revenue and locations outside the US have been excluded) to paint a multidimensional portrait of restaurant success. Both axes are plotted using a logarithmic scale to give a clearer picture of this winner-takes-all space.

The general trend becomes apparent: the more locations a restaurant has, the less revenue per store. We can observe different business models.

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
