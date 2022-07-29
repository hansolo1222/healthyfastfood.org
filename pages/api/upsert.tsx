// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma"

const mcdonalds = require("/public/data/mcdonalds.json");
const burgerking = require("/public/data/burger-king.json");


const restaurants = require("/public/restaurant_links.json");
import { supabase } from '../../lib/supabase'

export default async (req, res) => {




  try {

  // const { data, error } = await supabase
  // .from('meal')
  // .update(
    
  //     {
  
  //     "slug": "double-quarter-pounder-with-cheese",
  //       "calories": 780,
  //       "totalFat": 45,
  //       "saturated_fat": 21.0,
  //       "trans_fat": 2.5,
  //       "cholesterol": 175,
  //       "sodium": 1310,
  //       "totalCarbohydrates": 43,
  //       "dietaryFiber": 3,
  //       "sugar": 10,
  //       "protein": 51,
  //       "vitaminA": 20,
  //       "vitaminC": 6,
  //       "calcium": 20,
  //       "iron": 35,
  //       "allergensTrue": [
  //           "gluten",
  //           "milk",
  //           "soy",
  //           "wheat"
  //       ],
  //       "allergensFalse": [
  //           "egg",
  //           "fish",
  //           "peanuts",
  //           "shellfish",
  //           "tree nuts"
  //       ],
  //     }).eq({ "combinedSlug": "mcdonalds-double-quarter-pounder-with-cheese" })
  
  
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


  const upsertMeals = await prisma.$transaction(
    burgerking.map((meal)=>{
      return prisma.meal.upsert({
        where: {
          restaurantSlug_slug: {
            restaurantSlug: meal.restaurant_slug,
            slug: meal.slug
          }
        },
        update: {
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
        },
        create: {
          name: meal.meal_name,
          slug: meal.slug,
          combinedSlug: meal.restaurant_slug + "-" + meal.slug,
          restaurant: {
            connect: {
              slug: meal.restaurant_slug
            }
          },
          category: {
            connectOrCreate: {
              where: {
                name: meal.category
              },
              create: {
                name: meal.category
              }
            }
          },
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
        }
      })
    })

  )


const variants = burgerking.flatMap(
  meal => {
    if (meal.variants){
      meal.variants.map(variant => (variant.slug = meal.slug, variant.resturant_slug = meal.restaurant_slug));
    return meal.variants;
  }
}).filter((v)=>{return v!==undefined})


const upsertVariants = await prisma.$transaction(
  variants.map((
  meal => prisma.variant.create({
    data: {
          meal: {
            connect: {
                combinedSlug: meal.resturant_slug + "-" + meal.slug
            }
          },
          variantName: meal.variant_name,
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
        }
    })

))
)

//   const upsertVariants = await prisma.$transaction(
//     goldshell.flatMap(miner => {
//       miner.listings.map(listing => (listing.minerSlug = miner.slug));
//     return miner.listings;
//   }).map(listing =>
//     prisma.listing.upsert({

  res.send(JSON.stringify(upsertVariants, null, 2));
} catch (error) {
  console.log(error)
}
 }
