// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma";

const wendys = require("/public/data/wendys.json");
const dunkinDonuts = require("/public/data/dunkin-donuts.json");
let dataSource = dunkinDonuts;

import fs from "fs";
import path from "path";
const fsPromises = fs.promises;

export default async (req, res) => {
  try {


    const FILES_DIRECTORY = path.join(process.cwd(), "public", "data");

    const getFileNames = async () => {
      try {
        return await fsPromises
          .readdir(FILES_DIRECTORY)
          .then((list) => list.filter((item) => !/(^|\/)\.[^/.]/g.test(item)));
      } catch (err) {
        console.error("Error occured while reading directory!", err);
      }
    };

    let files = await getFileNames();

    const getRestaurants = await prisma.restaurant.findMany({
      where: {
        meals: {
          some: {
            calories: {
              gt: 0,
            },
          },
        },
      },
    });

    let alreadyCompleted = getRestaurants.map((r) => r.slug + ".json");
    let mealData = []

    files
    .filter((fileName) => !alreadyCompleted.includes(fileName) && fileName != 'starbucks.json')
    .map((fileName)=>{
      const dataSource = require("/public/data/" + fileName);
      mealData = [...mealData, ...dataSource]
    })

        // duplicates
    let sorted = mealData.map((d)=>(d.restaurant_slug + "-" + d.slug)).sort()
    const findDuplicates = arry => arry.filter((item, index) => sorted.indexOf(item) !== index)
    console.log(findDuplicates(sorted), "DUPLICATES!!!!!");

    
    let dataSource = mealData

          const formattedData = dataSource.map((meal) => {
            return {
              name: meal.meal_name,
              slug: meal.slug,
              restaurantSlug: meal.restaurant_slug,
              combinedSlug: meal.restaurant_slug + "-" + meal.slug,
              categoryName: meal.category,
              calories:
                meal.calories !== undefined ? Math.round(meal.calories) : null,
              totalFat: meal.total_fat !== undefined ? meal.total_fat : null,
              saturatedFat:
                meal.saturated_fat !== undefined ? meal.saturated_fat : null,
              transFat: meal.trans_fat !== undefined ? meal.trans_fat : null,
              cholesterol:
                meal.cholesterol !== undefined ? meal.cholesterol : null,
              sodium: meal.sodium !== undefined ? meal.sodium : null,
              totalCarbohydrates:
                meal.total_carbohydrates !== undefined
                  ? meal.total_carbohydrates
                  : null,
              dietaryFiber:
                meal.dietary_fiber !== undefined ? meal.dietary_fiber : null,
              sugar: meal.sugar !== undefined ? meal.sugar : null,
              protein: meal.protein !== undefined ? meal.protein : null,
              vitaminA: meal.vitamin_a !== undefined ? meal.vitamin_a : null,
              vitaminC: meal.vitamin_c !== undefined ? meal.vitamin_c : null,
              calcium: meal.calcium !== undefined ? meal.calcium : null,
              iron: meal.iron !== undefined ? meal.iron : null,
              ingredients: meal.ingredients,
              allergensTrue: meal.allergens_true,
              allergensFalse: meal.allergens_false,
            };
          });

          const meals = await prisma.meal.createMany({
            data: formattedData,
          });

          const formattedVariants = dataSource
            .flatMap((meal) => {
              if (meal.variants) {
                meal.variants.map(
                  (variant) => (
                    (variant.slug = meal.slug),
                    (variant.restaurant_slug = meal.restaurant_slug)
                  )
                );
                return meal.variants;
              }
            })
            .filter((v) => {
              return v !== undefined;
            })
            .map((variant) => {
              return {
                variantName: variant.variant_name,
                mealCombinedSlug: variant.restaurant_slug + "-" + variant.slug,
                calories:
                  variant.calories !== undefined
                    ? Math.round(variant.calories)
                    : null,
                totalFat:
                  variant.total_fat !== undefined ? variant.total_fat : null,
                saturatedFat:
                  variant.saturated_fat !== undefined
                    ? variant.saturated_fat
                    : null,
                transFat:
                  variant.trans_fat !== undefined ? variant.trans_fat : null,
                cholesterol:
                  variant.cholesterol !== undefined
                    ? variant.cholesterol
                    : null,
                sodium: variant.sodium !== undefined ? variant.sodium : null,
                totalCarbohydrates:
                  variant.total_carbohydrates !== undefined
                    ? variant.total_carbohydrates
                    : null,
                dietaryFiber:
                  variant.dietary_fiber !== undefined
                    ? variant.dietary_fiber
                    : null,
                sugar: variant.sugar !== undefined ? variant.sugar : null,
                protein: variant.protein !== undefined ? variant.protein : null,
                vitaminA:
                  variant.vitamin_a !== undefined ? variant.vitamin_a : null,
                vitaminC:
                  variant.vitamin_c !== undefined ? variant.vitamin_c : null,
                calcium: variant.calcium !== undefined ? variant.calcium : null,
                iron: variant.iron !== undefined ? variant.iron : null,
                ingredients: variant.ingredients,
                allergensTrue: variant.allergens_true,
                allergensFalse: variant.allergens_false,
              };
            });

          const variants = await prisma.variant.createMany({
            data: formattedVariants,
          });
        
    

    res.send(JSON.stringify(findDuplicates(sorted), null, 2));
  } catch (error) {
    console.log(error);
  }
};
