// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma"

const mcdonalds = require("/public/data/mcdonalds.json");
const burgerking = require("/public/data/burger-king.json");

const dataSource = require("/public/data/taco-bell.json");

const restaurants = require("/public/restaurant_links.json");
import { supabase } from '../../lib/supabase'

export default async (req, res) => {




  try {

  // const { data, error } = await supabase
  // .from('meal')
  // .update(  
  
  // const upsertRestaurants = await prisma.$transaction(
   
  //   restaurants.map((restaurant)=>{
  //     console.log(restaurant)
  //     return prisma.restaurant.upsert({
  //       where: {
  //         slug: restaurant.slug
  //       },
  //       update: {
  //         rank: restaurant.rank
  //       },
  //       create: {
  //         name: restaurant.restaurant_name,
  //         slug: restaurant.slug,
  //         rank: restaurant.rank ? restaurant.rank : null
  //       }
  //     })
  //   })
  // )


  // const upsertMeals = await prisma.$transaction(
  //   burgerking.map((meal)=>{
  //     return prisma.meal.upsert({
  //       where: {
  //         restaurantSlug_slug: {
  //           restaurantSlug: meal.restaurant_slug,
  //           slug: meal.slug
  //         }
  //       },
  //       update: {
  //         calories: meal.calories !== undefined ? Math.round(meal.calories) : null,
  //         totalFat: meal.total_fat !== undefined ? meal.total_fat : null,
  //         saturatedFat: meal.saturated_fat !== undefined ? meal.saturated_fat : null,
  //         transFat: meal.trans_fat !== undefined ? meal.trans_fat : null,
  //         cholesterol: meal.cholesterol !== undefined ? meal.cholesterol : null,
  //         sodium: meal.sodium !== undefined ? meal.sodium : null,
  //         totalCarbohydrates: meal.total_carbohydrates !== undefined ? meal.total_carbohydrates : null,
  //         dietaryFiber: meal.dietary_fiber !== undefined ? meal.dietary_fiber : null,
  //         sugar: meal.sugar !== undefined ? meal.sugar : null,
  //         protein: meal.protein !== undefined  ? meal.protein : null,
  //         vitaminA: meal.vitamin_a !== undefined ? meal.vitamin_a : null,
  //         vitaminC: meal.vitamin_c !== undefined ? meal.vitamin_c : null,
  //         calcium: meal.calcium !== undefined ? meal.calcium : null,
  //         iron: meal.iron !== undefined ?  meal.iron : null,
  //         ingredients: meal.ingredients,
  //         allergensTrue: meal.allergens_true,
  //         allergensFalse: meal.allergens_false
  //       },
  //       create: {
  //         name: meal.meal_name,
  //         slug: meal.slug,
  //         combinedSlug: meal.restaurant_slug + "-" + meal.slug,
  //         restaurant: {
  //           connect: {
  //             slug: meal.restaurant_slug
  //           }
  //         },
  //         category: {
  //           connectOrCreate: {
  //             where: {
  //               name: meal.category
  //             },
  //             create: {
  //               name: meal.category
  //             }
  //           }
  //         },
  //         calories: meal.calories !== undefined ? Math.round(meal.calories) : null,
  //         totalFat: meal.total_fat !== undefined ? meal.total_fat : null,
  //         saturatedFat: meal.saturated_fat !== undefined ? meal.saturated_fat : null,
  //         transFat: meal.trans_fat !== undefined ? meal.trans_fat : null,
  //         cholesterol: meal.cholesterol !== undefined ? meal.cholesterol : null,
  //         sodium: meal.sodium !== undefined ? meal.sodium : null,
  //         totalCarbohydrates: meal.total_carbohydrates !== undefined ? meal.total_carbohydrates : null,
  //         dietaryFiber: meal.dietary_fiber !== undefined ? meal.dietary_fiber : null,
  //         sugar: meal.sugar !== undefined ? meal.sugar : null,
  //         protein: meal.protein !== undefined  ? meal.protein : null,
  //         vitaminA: meal.vitamin_a !== undefined ? meal.vitamin_a : null,
  //         vitaminC: meal.vitamin_c !== undefined ? meal.vitamin_c : null,
  //         calcium: meal.calcium !== undefined ? meal.calcium : null,
  //         iron: meal.iron !== undefined ?  meal.iron : null,
  //         ingredients: meal.ingredients,
  //         allergensTrue: meal.allergens_true,
  //         allergensFalse: meal.allergens_false
  //       }
  //     })
  //   })

  // )


  const formattedData = dataSource.map((meal)=>{
    return ({
      name: meal.meal_name,
      slug: meal.slug,
      restaurantSlug: meal.restaurant_slug,
      combinedSlug: meal.restaurant_slug + "-" + meal.slug, 
      categoryName: meal.category,
      calories: meal.calories !== undefined ? Math.round(meal.calories) : null,
      totalFat: meal.total_fat !== undefined ? meal.total_fat : null,
      saturatedFat: meal.saturated_fat !== undefined ? meal.saturated_fat : null,
      transFat: meal.trans_fat !== undefined ? meal.trans_fat : null,
      cholesterol: meal.cholesterol !== undefined ? meal.cholesterol : null,
      sodium: meal.sodium !== undefined ? meal.sodium : null,
      totalCarbohydrates: meal.total_carbohydrates !== undefined ? meal.total_carbohydrates : null,
      dietaryFiber: meal.dietary_fiber !== undefined ? meal.dietary_fiber : null,
      sugar: meal.sugar !== undefined ? meal.sugar : null,
      protein: meal.protein !== undefined  ? meal.protein : null,
      vitaminA: meal.vitamin_a !== undefined ? meal.vitamin_a : null,
      vitaminC: meal.vitamin_c !== undefined ? meal.vitamin_c : null,
      calcium: meal.calcium !== undefined ? meal.calcium : null,
      iron: meal.iron !== undefined ?  meal.iron : null,
      ingredients: meal.ingredients,
      allergensTrue: meal.allergens_true,
      allergensFalse: meal.allergens_false
    })
  }
  )

  console.log(formattedData)


  const createMany = await prisma.meal.createMany({
    data: formattedData
    })

    const formattedVariants = dataSource.flatMap(
      meal => {
        if (meal.variants){
          meal.variants.map(variant => (variant.slug = meal.slug, variant.restaurant_slug = meal.restaurant_slug));
        return meal.variants;
      }
    }).filter((v)=>{return v!==undefined}).map((variant)=>{
      return ({
        variantName: variant.variant_name,
        mealCombinedSlug: variant.restaurant_slug + "-" + variant.slug, 
        calories: variant.calories !== undefined ? Math.round(variant.calories) : null,
        totalFat: variant.total_fat !== undefined ? variant.total_fat : null,
        saturatedFat: variant.saturated_fat !== undefined ? variant.saturated_fat : null,
        transFat: variant.trans_fat !== undefined ? variant.trans_fat : null,
        cholesterol: variant.cholesterol !== undefined ? variant.cholesterol : null,
        sodium: variant.sodium !== undefined ? variant.sodium : null,
        totalCarbohydrates: variant.total_carbohydrates !== undefined ? variant.total_carbohydrates : null,
        dietaryFiber: variant.dietary_fiber !== undefined ? variant.dietary_fiber : null,
        sugar: variant.sugar !== undefined ? variant.sugar : null,
        protein: variant.protein !== undefined  ? variant.protein : null,
        vitaminA: variant.vitamin_a !== undefined ? variant.vitamin_a : null,
        vitaminC: variant.vitamin_c !== undefined ? variant.vitamin_c : null,
        calcium: variant.calcium !== undefined ? variant.calcium : null,
        iron: variant.iron !== undefined ?  variant.iron : null,
        ingredients: variant.ingredients,
        allergensTrue: variant.allergens_true,
        allergensFalse: variant.allergens_false
      })
    })

  const createManyVariants = await prisma.variant.createMany({
    data: formattedVariants
    })


//   const upsertVariants = await prisma.$transaction(
//     goldshell.flatMap(miner => {
//       miner.listings.map(listing => (listing.minerSlug = miner.slug));
//     return miner.listings;
//   }).map(listing =>
//     prisma.listing.upsert({

  res.send(JSON.stringify(formattedVariants, null, 2));
} catch (error) {
  console.log(error)
}
 }
