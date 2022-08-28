// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma"
var slugify = require('slugify')


const categories = require("/public/all_categories.json");

const categoriesWithParents = require("/public/all_categories_with_restaurants.json");


export default async (req, res) => {

  try {

    const getCategories = await prisma.category.findMany()



  const upsertCategories = await prisma.$transaction(
    getCategories.map((cat) => (
      // console.log(slugify(cat.name.replace("/", " "), {lower:true, remove: /[*+~.,()'"!:@]/g}))
      prisma.category.upsert({
        where: {
          name: cat.name
        }, 
        update: {
          slug: slugify(cat.name.replace("/", " "), {lower:true, remove: /[*+~.,()'"!:@]/g})
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
