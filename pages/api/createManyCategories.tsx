// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma"

const mcdonalds = require("/public/data/mcdonalds.json");
const burgerking = require("/public/data/burger-king.json");

const dataSource = require("/public/data/chick-fil-a.json");

const categories = require("/public/all_categories.json");
const restaurants = require("/public/restaurant_links.json");
import { supabase } from '../../lib/supabase'

export default async (req, res) => {

  try {

  // const upsertCategories = await prisma.$transaction(
  //   formattedCategories.map((cat) => (
  //     prisma.category.upsert({
  //       where: {
  //         name: cat.name
  //       }, 
  //       update: {

  //       }, 
  //       create: {
  //         name: cat.name
  //       }
      
  //     })
  //   )
  // ))

    const formattedCategories = categories.map((c)=>({"name":c}))

  // const upsertCategories = await prisma.category.createMany({
  //   data: formattedCategories
  // })




  res.send(JSON.stringify(formattedCategories, null, 2));
} catch (error) {
  console.log(error)
}
 }
