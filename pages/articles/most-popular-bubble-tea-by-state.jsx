import React, { PureComponent } from "react";
const restaurants = require("/public/restaurantData/tope.json");
import _ from "lodash";
import ReactMarkdown from "react-markdown";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  LogarithmicScale,
} from "chart.js";
import { Scatter, Bubble } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import Layout from "../../components/Layout";
import * as ChartGeo from 'chartjs-chart-geo';
import { useEffect } from "react";

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
    y: r.revenuePerStore,
    r: Math.sqrt(r.salesMillions / Math.PI)/2,
  })),
  (restaurant) => restaurant.type
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  LogarithmicScale,
  ChartGeo.ChoroplethController,
  ChartGeo.ProjectionScale,
  ChartGeo.ColorScale,
  ChartGeo.GeoFeature
);

const footer = (tooltipItems) => {
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

Object.keys(grouped).forEach((key) => {
  // const image = new Image()
  // image.src = '/images/logosSmall/mcdonalds.webp'
  datasets.push({
    label: key,
    data: grouped[key],
    backgroundColor: colorMap[key],
    // pointStyle: ['', '', '', '', image ],
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
# The Most Popular Bubble Tea Brand in Every US State

SEPTEMBER 19, 2022

Bubble tea has been a popular drink in Asian countries since the 80s, but has only exploded in popularity in the USA in the past 10 years. Its recent popularity is driven by [Gen Z's embrace of the drink](https://www.teaandcoffee.net/blog/29617/boba-tea-re-emerges-and-surges-in-popularity-thanks-to-gen-z/).

To find out which brands are the most popular, we compared internet search volume for 50+ notable bubble tea brands. While **Kung Fu Tea**, a chain established in 2010 in Queens, NY dominates, winning 36/50 states, we discovered that smaller local shops had outsized brand recognition in their home states.

![The Most Popular Bubble Tea in every US State by HealthyFastFood.org](/images/articles/most-popular-bubble-tea-by-state/bubble-tea-state.png)

## Kung Fu Tea Dominates in the US

- **Winner in: 36/50 states**
- Founded: 2010, Queens, NY

Kung Fu Tea was America's largest bubble tea brand with over 350+ locations across the U.S.

In 2018, the company partnered with Taiwan-based chain TKK Fried Chicken to open collaborative locations in the United States. In 2021, Kung Fu Tea was included among Nation's Restaurant News Top 500 Restaurant Chains, the only bubble tea chain to make the list.

They have an app and an online ordering system, so you can order before you go.

Popular drinks: Kung Fu Milk Tea, Melon Green Milk Tea

![Kung Fu Tea Location and drinks](/images/articles/most-popular-bubble-tea-by-state/kung-fu-tea.jpg) 

`}
</ReactMarkdown>

<h2 id="other-winners"></h2>

<ReactMarkdown>
{`
## The Other Winners

### Sharetea

- **Winner in: California, Kentucky, Oregon**
- Founded: 1992, Taipei, Taiwan

Sharetea was founded in 1992 by Chen Kai Lang, after he quit his job as a film and TV director.

The chain serves hot and cold beverages that include ice cream, pudding, lychee, jellies, boba and more.

To date they have over 500 locations in 18+ countires. The tea leaves are grown in the high mountains of Taiwan and shipped to stores worldwide.

Popular drinks: Classic Black Milk Tea, Matcha Green Tea

![Share Tea Location](/images/articles/most-popular-bubble-tea-by-state/share-tea.png)

### Brew Tea Bar

- **Winner in: Nevada**
- Founded: 2015, Las Vegas, Nevada

The Brew Tea Bar has only 3 locations in Las Vegas, however they beat out larger chains in both brand recognition and foot traffic. Las Vegas bubble tea aficionados will rave about this shop because of its fresh ingredients and a huge selection. 

Their flagship store is located at 7380 S Rainbow Blvd, and has over 2400 Yelp reviews, the most of any bubble tea shop in Nevada.

Popular drinks: Hokkaido Milk Tea, Okinawa Milk Tea, Taro Slush

![Share Tea Location](/images/articles/most-popular-bubble-tea-by-state/brew-tea-bar.webp)

### Milk Run

- **Winner in: Arizona**
- Founded: 2017, Phoeniz, Arizona

Milk Run was founded by Arizona native Tho Ly, who originally worked as a microbiologist. The shop is known for turning traditional flavors into new creations. At Milk Run, boba is a welcome addition to house-made Sriracha ice cream or to a milk tea float, a colorful milk tea served in a milk bottle, topped with ice cream and Pocky (chocolate-dipped biscuit). The colorful menu also includes tropical fruit-infused smoothies and Vietnamese coffees

Popular drinks: Az Sunset Tea, Vietnamese Coffee

![Share Tea Location](/images/articles/most-popular-bubble-tea-by-state/milk-run.jpeg)

### Ding Tea

- **Winner in: Utah**
- Founded: 2014, Taipei, Taiwan

Ding Tea was founded in 2004 by Xu Wei-xiang. We noticed it ranked #2 for many states, but it only took the crown in Utah.

Ding Tea is known for its focus on the 'tea' part of bubble tea. It's one of the best spots if you prefer tea flavors over the creamy milk flavor characteristic of bubble tea, but is also a great spot for a balance between the two flavors.

Its motto is: "Shake for life" for good reason. Ding Tea uses a cocktail shaker to hand mix each drink

Popular Drinks: Golden Boba, Brown Sugar Milk Tea, Jasmine Green Milk Tea

![Ding Tea](/images/articles/most-popular-bubble-tea-by-state/ding-tea.jpg)

### Boise Boba

- **Winner in: Idaho**
- Founded: 2017, Boise, Idago

The locally owned and operated Boise Boba has 3 locations in Idaho. Founded by Steve Salas and Brandi Dunlap, the brand is known for its innovative menu that combines traditional boba flavors with fruity blends.

Popular Drinks: Purple Velvet (Taro/Coconut), Moo Moo (Golden tea/Taro)

![Ding Tea](/images/articles/most-popular-bubble-tea-by-state/boise-boba.jpeg)

### Chatime

- **Winner of: North Dakota**
- Founded: 2005, Zhubei, Taiwan

Chatime is the largest tea chain in the world, with over 2500 stores in 38 countries. Despite having such a large global presence, it only won the most popular spot in one state, North Dakota! We noticed that it did win #2 in many states.

The company opened its first outlet outside of Taiwan in California in 2006,followed by Australia in 2009, and Malaysia in 2010. Today its Malaysian operations currently account for almost 50% of its global revenue.

The brand's bestselling drink is its Chatime Pearl Milk Tea. The most popular toppings are boba and "QQ" jelly, which is a mixture of pearls and nata de coco.

Popular Drinks: Pearl Milk Tea

![Chatime Location and drink](/images/articles/most-popular-bubble-tea-by-state/chatime.jpg)

### Tasteas

- **Winner of: South Dakota**
- Founded: Sioux Falls

Tasteas is a bubble tea and waffle house that was established in Sioux Falls in 2017. It offers tea, smoothies and waffle sundaes, and Thai rolled ice cream.

The store is especially known for its bubble waffles. Bubble waffles, also called egg waffles, are a popular street food in Taiwan and Hong Kong.  They are cooked in a bubble shape, rolled into a cone, and filled with ice cream and other toppings.

Popular Items: Bubble Milk Black Tea, Savory Bubble Waffle

![Chatime Location and drink](/images/articles/most-popular-bubble-tea-by-state/tasteas.jpg)

### Teapioca Lounge

- **Winner of: Oklahoma**
- Founded: Austin, Texas

Teapioca Lounge is a Texas based brand. To date it has 22 locations: 13 in Texas, 5 in Oklahoma City and the rest in Colorado and Pennsylvania.

Their locations often have a collection of board games and are known for their comfortable environments. Teapioca Lounge menus often feature over 100 types of drinks!

Popular Drinks: Matcha Green Tea

![Teapioca Lounge](/images/articles/most-popular-bubble-tea-by-state/teapioca-lounge.jpeg)

### Fruitealicious

- **Winner of: Arkansas**
Founded: 2020, Austin, Texas

Most Fruitealicious locations are located in Texas, however its Arkansas locations were enough to push it to #1 most searched brand in the state.

Popular Drinks: Black Sugar Milk Tea, Vietnamese Iced Coffee

![Fruitealicious](/images/articles/most-popular-bubble-tea-by-state/fruitealicious.jpeg)

### Gong Cha

- **Winner of: Massachusetts**
- Founded: 2006, Kaohsiung, Taiwan

Bubble Tea aficionados will recognize Gong Cha, a Taiwanese brand with 1800+ locations in over 20 countries. In the US, the brand's stores are clustered around Texas, New York and Boston, so its no surprise that the brand wins in Massachusetts.

Gong cha is known for its signature Milk Foam. The creamy whipped foam is added into the tea and blended by shaking.

![Gong Cha Milk Foam Tea and Location](/images/articles/most-popular-bubble-tea-by-state/gong-cha.jpg)

### Happy House Tea

- **Winner of: Alaska**
- Founded: Anchorage, Alaska

Happy House Tea is an Anchorage based drive-through bubble tea location that is known for its minimal menu and unique flavor combinations.

Popular Drinks: The Classic, Thai Treat

![Happy House Tea location and drinks](/images/articles/most-popular-bubble-tea-by-state/happy-house.jpg)

And that's the most popular boba in every state, by search volume!











`}
        </ReactMarkdown>
      </div>
      </div>
    </Layout>
  );
}

// ## Methodology:

// This graph shows the most popular Bubble Tea brand by state, as measured by Google search volume.

// Google Trends and Google Keyword Planner are used to determine relative search volume. Adobe Illustrator used for the Image above, and Chart.js is used for interactive visualization

// ## Limitations

// This chart runs into the same limitations as other cholorpleth charts.

// If misterpreted, it can greatly exagerate the popularity of small brands, and brands who have established themselves in states without many bubble tea shops.

// For example, Chatime, Gong Cha and Sharetea are nationwide brands that all rank for #2 most popular in many states, however only win the title for one state each. At first glance this makes it appear as if they have the same presence as smaller, state-level brands like Milk Run, which is only widely known in Arizona.


// Sharetea: California, Kentucky, Oregon
// Brew Tea Bar: Nevada
// Milk Run: Arizona
// Ding Tea: Utah
// Boise Boba: Idaho
// Chatime: North Dakota
// Tasteas: South Dakota
// Teapioca Lounge: Oklahoma
// Fruitealicious: Arkansas
// Gong Cha: Massachusetts
// Happy House Tea: Alaska

// mOO mOo tea: Hawaii 
// Dobra Tea: Maine, Vermont