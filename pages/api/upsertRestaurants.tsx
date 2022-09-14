import prisma from "../../lib/prisma";
let searchVolume = require("/public/search-volume.json");
// let restaurantData = require("/public/250_restaurant_data.json");
var slugify = require("slugify");

let restaurantDataWikipedia = require("/public/restaurantData/wikipedia.json");

restaurantDataWikipedia = restaurantDataWikipedia.slice(260);

let restaurantDataNew= require("/public/FINAL.json");

console.log(restaurantDataNew.length)

let restaurantDataNewSlice = restaurantDataNew.slice(0,1);

console.log(restaurantDataNewSlice)
export default async (req, res) => {
  try {

    const upsertRestaurants = await prisma.$transaction(

      restaurantDataNewSlice.map((rest) => {

        console.log(rest.type.includes(",") ? rest.type.split(", ").map((type)=> ({name: type})) : rest.type.split().map((type)=> ({name: type})))

        return prisma.restaurant.upsert({
          where: {
            slug: rest.slug,
          },
          update: {
            name: rest.name,
            slug: rest.slug,

            keyword: rest.keyword,
            website: rest.website,

            originalLocation: rest.originalLocation,
            originalCountry: rest.originalCountry,
            founded: rest.founded.toString(),
            headquarters: rest.headquarters,
            areasServed: rest.areasServed.split(", "),

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
            restaurantTypes: {
              connect: rest.type.includes(",") ? rest.type.split(", ").map((type)=> ({name: type})) : rest.type.split().map((type)=> ({name: type}))
            },
          },
          create: {
            name: rest.name,
            slug: rest.slug,

            keyword: rest.keyword,
            website: rest.website,

            originalLocation: rest.originalLocation,
            originalCountry: rest.originalCountry,
            founded: rest.founded.toString(),
            headquarters: rest.headquarters,
            areasServed: rest.areasServed.split(", "),
            locations: rest["Locations"] ? parseInt(rest["Locations"]) : null,
            
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
            restaurantTypes: {
              connect: rest.type.includes(",") ? rest.type.split(", ").map((type)=> ({name: type})) : rest.type.split().map((type)=> ({name: type}))
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
