'use server'

import prisma from "../../lib/prisma"
import { revalidatePath } from "next/cache"

export async function migrateAllergens() {
  try {
    // Get total count first for progress tracking
    const totalMeals = await prisma.meal.count({
      where: {
        restaurantSlug: "mcdonalds"
      }
    });
    
    const meals = await prisma.meal.findMany({
      where: {
        restaurantSlug: "mcdonalds"
      },
      select: {
        id: true,
        name: true,
        allergensTrue: true,
        restaurantSlug: true
      }
    });

    const allergenMap = {
      'dairy': 'allergen_milk',
      'milk': 'allergen_milk',
      'eggs': 'allergen_eggs',
      'fish': 'allergen_fish',
      'shellfish': 'allergen_shellfish',
      'tree nuts': 'allergen_tree_nuts',
      'peanuts': 'allergen_peanuts',
      'wheat': 'allergen_wheat',
      'soy': 'allergen_soy',
      'gluten': 'allergen_gluten'
    } as const;

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const meal of meals) {
      try {
        const updates: Record<string, boolean> = {};
        
        meal.allergensTrue.forEach(allergen => {
          const field = allergenMap[allergen.toLowerCase() as keyof typeof allergenMap];
          if (field) {
            updates[field] = true;
          }
        });

        if (Object.keys(updates).length > 0) {
          await prisma.meal.update({
            where: { id: meal.id },
            data: updates
          });
          successCount++;
        }
      } catch (error) {
        errorCount++;
        errors.push(`Failed to update meal "${meal.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Revalidate McDonald's pages
    revalidatePath('/mcdonalds');
    revalidatePath('/restaurants');

    if (errorCount > 0) {
      return {
        success: false,
        message: `Processed ${meals.length} McDonald's meals. ${successCount} succeeded, ${errorCount} failed.`,
        details: errors.join('\n')
      };
    }

    return {
      success: true,
      message: `Successfully updated ${successCount} out of ${totalMeals} McDonald's meals.`,
      details: `No errors encountered.`
    };

  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      message: 'Migration failed',
      details: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
 