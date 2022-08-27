import prisma from "../../lib/prisma";
let searchVolume = require("/public/search-volume.json");
// let restaurantData = require("/public/250_restaurant_data.json");
var slugify = require("slugify");

let restaurantDataWikipedia = require("/public/restaurantData/wikipedia.json");

restaurantDataWikipedia = restaurantDataWikipedia.slice(260);

let typeData = [
  {
    name: "Pizza",
    description:
      "Since its introduction to the US by Italian immigrants in the early-20th century, pizza has become an iconic food of considerable popularity. Variations include deep-dish, stuffed, pockets, and turnovers."
  },
  {
    name: "Chicken",
    description:
      "There are many different types of chicken based dishes such as fried chicken, chicken sandwiches, or chicken and biscuits. Many restaurants specialize in wings as entrees."
  },
  {
    name: "Frozen Desserts",
    description:
      "Ice cream is one of the most popular desserts in the US. It is served with a wide variety of flavors and styles, and has sugar-free and fat-free alternatives. Frozen yogurt is growing in popularity as a healthier alternative to ice cream."
  },
  {
    name: "Seafood",
    description:
      "Seafood is available in both farm raised and wild varieties; fish such as catfish, tilapia, and salmon are routinely farm raise, while swordfish, tuna, and shark are caught wild."
  },
  {
    name: "Asian",
    description:
      "The dishes served in many North American Asian restaurants are adapted to American tastes and often differ significantly from those found in their respective countries."
  },
  {
    name: "Baked Goods",
    description:
      "Baked goods are foods made from dough or batter and cooked by baking in an oven. They are served in bakeries, cafes and specialty dessert shops."
  },
  {
    name: "Barbeque",
    description:
      "Barbeque (or barbecue) refers to methods that use smoke and fire to cook food, as well as the cuisine that these methods produce. American barbecue as we know it was born in the south, and each Southern locale has its own variety."
  },
  {
    name: "Hamburgers",
    description:
      "The hamburger is the food most strongly associated with fast food restaurants today. White Castle is credited with opening the first hamburger chain in 1921. They made the first attempt to standardize food production, spawning numerous competitors and emulators."
  },
  {
    name: "Hot Dogs",
    description:
      "Hot dogs originate from German frankfurters. They became a popular street food in the US, sold at stands and carts. Although associated with New York City, the hot dog became ubiquitous throughout the US in the 20th century."
  },
  {
    name: "Mexican/Tex-Mex",
    description:
      "Due in part to franchising, immigration, and taste, Mexican food has been a regular part of American cuisine. While some of these iterations of Mexican food are far removed from their Mexican origins, they have become established in their own right."
  },
  {
    name: "Breakfast",
    description:
      "Historians think that the brunch came about thanks to the South's favorite pastimes of hunting and church-going. Restaurants were happy to specialize in a morning and late-morning crowd."
  },
  {
    name: "Steakhouse",
    description:
      "Out of working-class chophouses and the upper-class beefsteak banquets, the true US-style steakhouse was born in the mid 1800s. The first steakhouses were established in New York, and set themselves apart by serving high quality cuts of meat in a clean environment."
  },
  {
    name: "Beverages",
    description:
      "In the late 1970s, a new wave of coffee culture emerged across the US. This was when café culture really started to become a social concept across the country, and people started to spend a lot of time in coffee shops."
  },
  {
    name: "American",
    description:
      "What makes a food 'American'? Nearly all popular American foods originated in other countries. Every dish carries with it many generations' worth of social complexities and innovations." 
  },
  {
    name: "Italian",
    description:
    "As immigrants from the different regions of Italy settled throughout the various regions of the United States, many brought with them a distinct regional Italian culinary tradition. Many of these foods and recipes developed into new favorites for Americans nationwide." 
  },
  {
    name: "Bar/Brewpub",
    description:
    "The term “pub” is shortened for “public house” and was initially a focal point of small towns and designated as drinking establishments. They typically offered beer, wine, and spirits." 
  },
  {
    name: "Sandwiches",
    description:
    "In the US, the sandwich was first promoted as an elaborate meal at supper. By the early 20th century, as bread became a staple of the American diet, the sandwich became the same kind of popular, quick meal as was already widespread in the Mediterranean." 
  },
  {
    name: "Carribean",
    description:
    "One of the strongest Caribbean influences on American foods is making several of the latter dishes more spicy. It's customary to see dishes like spicy Jamaican foods like Jerk Chicken and Pork, curried mutton and oxtail and beans, in Caribbean restaurants." 
  },
  {
    name: "European",
    description:
    "The most popular European cuisines in the US apart from Italian food include French, Spanish and Polish food." 
  },
  {
    name: "Salad",
    description:
    "Only in recent years have salads become a competitor in the fast-casual restaurant category. As healthy eating has moved from a niche pursuit to a mainstream interest, the popularity of made-to-order salads has boomed."
  },
  {
    name: "Beef",
    description:
    "The term “pub” is shortened for “public house” and was initially a focal point of small towns and designated as drinking establishments. They typically offered beer, wine, and spirits." 
  },
];

export default async (req, res) => {
  try {
    // const updateTypes = await prisma.$transaction(
    //   typeData.map((data)=>{
    //     return prisma.restaurantType.upsert({
    //       where: {
    //         name: data.name
    //       },
    //       update: {
    //         description: data.description
    //       },
    //       create: {
    //         name: data.name,
    //         slug: data.name,
    //         description: data.description
    //       }
    //     })
    //   })

    // );

    const upsertRestaurants = await prisma.$transaction(
      restaurantDataWikipedia.map((rest) => {
        return prisma.restaurant.upsert({
          where: {
            slug: rest.slug,
          },
          update: {
            slug: rest.slug,
            name: rest.name,
            locations: rest["Locations"] ? parseInt(rest["Locations"]) : null,
            originalLocation: rest.originalLocation,
            founded: rest.founded.toString(),
            headquarters: rest.headquarters,
            areasServed: rest.areasServed.split(","),
            segment: {
              connectOrCreate: {
                where: {
                  slug: rest.service,
                },
                create: {
                  name: rest.service,
                  slug: rest.service,
                },
              },
            },
            restaurantType: {
              connectOrCreate: {
                where: {
                  slug: rest.type,
                },
                create: {
                  name: rest.type,
                  slug: rest.type,
                },
              },
            },
          },
          create: {
            slug: rest.slug,
            name: rest.name,
            locations: rest["Locations"] ? parseInt(rest["Locations"]) : null,
            originalLocation: rest.originalLocation,
            founded: rest.founded.toString(),
            headquarters: rest.headquarters,
            areasServed: rest.areasServed.split(","),
            segment: {
              connectOrCreate: {
                where: {
                  slug: rest.service,
                },
                create: {
                  name: rest.service,
                  slug: rest.service,
                },
              },
            },
            restaurantType: {
              connectOrCreate: {
                where: {
                  slug: rest.type,
                },
                create: {
                  name: rest.type,
                  slug: rest.type,
                },
              },
            },
          },
        });
      })
    );

    // const upsertMeals = await prisma.$transaction(
    //   restaurantData.map((rest)=>{
    //     return prisma.restaurant.upsert({
    //       where: {
    //         slug: rest.slug
    //       },
    //       update: {
    //         name: rest.name,
    //         rank: rest.rank,
    //         salesMillions: parseInt(rest.salesMillions),
    //         locations: parseInt(rest.locations),
    //         segment: {
    //           connectOrCreate: {
    //             where: {
    //               slug: rest.segment
    //             },
    //             create: {
    //               name: rest.segment,
    //               slug: rest.segment
    //             }
    //           }
    //         },
    //         restaurantType: {
    //           connectOrCreate: {
    //             where: {
    //               slug: rest.category
    //             },
    //             create: {
    //               name: rest.category,
    //               slug: rest.category
    //             }
    //           }
    //         },
    //       },
    //       create: {
    //         slug: rest.slug,
    //         name: rest.name,
    //         rank: rest.rank,
    //         salesMillions: parseInt(rest.salesMillions),
    //         locations: parseInt(rest.locations),
    //         segment: {
    //           connectOrCreate: {
    //             where: {
    //               slug: rest.segment
    //             },
    //             create: {
    //               name: rest.segment,
    //               slug: rest.segment
    //             }
    //           }
    //         },
    //         restaurantType: {
    //           connectOrCreate: {
    //             where: {
    //               slug: rest.category
    //             },
    //             create: {
    //               name: rest.category,
    //               slug: rest.category
    //             }
    //           }
    //         },
    //       }
    //     })
    //   }
    // ))

    // const getRestaurants = await prisma.restaurant.findMany({
    //   orderBy: [
    //     {
    //       slug: "asc",
    //     },
    //   ],
    // });

    // let formatted = getRestaurants.map((r)=>r.slug.replaceAll('-',' '))

    res.send(JSON.stringify(upsertRestaurants, null, 2));
  } catch (error) {
    console.log(error);
  }
};
