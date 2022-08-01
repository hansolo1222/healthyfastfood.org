import prisma from "../../lib/prisma";
let searchVolume = require("/public/search-volume.json");
let restaurantData = require("/public/250_restaurant_data.json");



export default async (req, res) => {
  try {

  restaurantData = restaurantData.slice(-155)

  const upsertMeals = await prisma.$transaction(
    restaurantData.map((rest)=>{
      return prisma.restaurant.upsert({
        where: {
          slug: rest.slug
        },
        update: {
          name: rest.name,
          rank: rest.rank,
          salesMillions: parseInt(rest.salesMillions),
          locations: parseInt(rest.locations),
          segment: {
            connectOrCreate: {
              where: {
                slug: rest.segment
              },
              create: {
                name: rest.segment,
                slug: rest.segment
              }
            }
          },
          restaurantType: {
            connectOrCreate: {
              where: {
                slug: rest.category
              },
              create: {
                name: rest.category,
                slug: rest.category
              }
            }
          },
        },
        create: {
          slug: rest.slug,
          name: rest.name,
          rank: rest.rank,
          salesMillions: parseInt(rest.salesMillions),
          locations: parseInt(rest.locations),
          segment: {
            connectOrCreate: {
              where: {
                slug: rest.segment
              },
              create: {
                name: rest.segment,
                slug: rest.segment
              }
            }
          },
          restaurantType: {
            connectOrCreate: {
              where: {
                slug: rest.category
              },
              create: {
                name: rest.category,
                slug: rest.category
              }
            }
          },
        }
      })
    }
  ))
        

    // const getRestaurants = await prisma.restaurant.findMany({
    //   orderBy: [
    //     {
    //       slug: "asc",
    //     },
    //   ],
    // });

    // let formatted = getRestaurants.map((r)=>r.slug.replaceAll('-',' '))


    res.send(JSON.stringify(upsertMeals, null, 2));
  } catch (error) {
    console.log(error);
  }
};
