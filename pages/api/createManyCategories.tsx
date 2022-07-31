// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma"

const categories = require("/public/all_categories.json");

const categoriesWithParents = require("/public/all_categories_with_restaurants.json");


export default async (req, res) => {

  try {


  const upsertCategories = await prisma.$transaction(
    categoriesWithParents.map((cat) => (
      prisma.category.upsert({
        where: {
          name: cat.name
        }, 
        update: {
          parentCategory: {
            connectOrCreate: {
              where: { 
                name: cat.parentCategory
              },
              create: {
                name: cat.parentCategory,
                slug: cat.parentCategory
              }
            }
          }
        }, 
        create: {
          name: cat.name
        }
      
      })
    )
  ))

    // const formattedCategories = categories.map((c)=>({"name":c}))

  // const upsertCategories = await prisma.category.createMany({
  //   data: formattedCategories
  // })


  res.send(JSON.stringify(upsertCategories, null, 2));
} catch (error) {
  console.log(error)
}
 }
