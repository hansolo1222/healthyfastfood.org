import prisma from "../../lib/prisma";
let searchVolume = require("/public/search-volume.json");
// let restaurantData = require("/public/250_restaurant_data.json");
var slugify = require("slugify");

let restaurantDataWikipedia = require("/public/restaurantData/wikipedia.json");

restaurantDataWikipedia = restaurantDataWikipedia.slice(260);


export default async (req, res) => {
  try {
    // This is the first pass of upsertMenus

    // A menu consists of a Restaurant, a Country and meals (and later on, a price)

    // const upsertMenus = await prisma.$transaction(
    //   restaurantDataWikipedia.map((rest) => {
    //     return prisma.menu.upsert({
    //       where: {
    //         menuCountryAndRestaurant = r.slug + "US-"
    //       }

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
