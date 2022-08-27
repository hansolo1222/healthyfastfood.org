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
        

    const getRestaurants = await prisma.restaurant.findMany({
      orderBy: [
        {
          slug: "asc",
        },
      ],
    });

    let formatted = getRestaurants.map((r)=>r.slug)


    res.send(JSON.stringify(formatted, null, 2));
  } catch (error) {
    console.log(error);
  }
};
