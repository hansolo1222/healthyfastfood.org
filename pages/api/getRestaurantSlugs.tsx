import prisma from "../../lib/prisma";
let searchVolume = require("/public/search-volume.json");



export default async (req, res) => {
  try {



  // const upsertMeals = await prisma.$transaction(
  //   searchVolume.map((rest)=>{
  //     return prisma.restaurant.update({
  //       where: {
  //         slug: rest["Keyword"]
  //       },
  //       data: {
  //         usVolume: rest["Volume"],
  //         globalVolume: rest["Global-volume"],
  //         difficulty: rest["Difficulty"]
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

    // let formatted = getRestaurants.map((r)=>r.slug)

    const restaurants = await prisma.restaurant.findMany({
      orderBy: [
        {
          rank: "desc",
        },
      ],
      include: {
        segment: true,
        _count: {
          select: { meals: true },
        },
      },
    })
    let formatted = restaurants.map((r)=>({slug: r.slug, count: r._count.meals}))


    res.send(JSON.stringify(formatted, null, 2));
  } catch (error) {
    console.log(error);
  }
};
