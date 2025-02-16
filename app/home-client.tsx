"use client"

import { Button } from "@/components/ui/button"
import { MiniTableMealRow } from "../components/TableMealRow"
import Image from "next/image"
import Link from "next/link"
import RestaurantCloud from "../components/RestaurantCloud"

export default function HomeClient({ 
  restaurants,
  parentCategories,
  topProteinMeals
}) { 
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20  ">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find the Healthiest Options at Every Restaurant
                <span className="text-stone-500 block mt-2">Compare nutrition facts across chains</span>
              </h1>
              <p className="text-xl text-stone-600 mb-8">
                Stop guessing. Get detailed nutrition facts, allergen info, and personalized recommendations for 100+ restaurant chains.
              </p>
              <div className="flex gap-4">
                <Button size="lg" asChild>
                  <Link href="/restaurants">Compare Restaurants</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/categories">Browse by Category</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/images/hero-comparison.png" 
                alt="Restaurant comparison"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="pt-6 pb-12 bg-stone-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-stone-600 mb-8">Featuring nutrition data from:</p>
          <RestaurantCloud restaurants={restaurants.slice(0, 45)} />
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Make Better Food Choices
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Compare Everything</h3>
              <p className="text-stone-600">
                Filter by calories, protein, carbs and more across every menu item
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Visual Insights</h3>
              <p className="text-stone-600">
                Interactive charts help you discover the best options for your diet
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🥗</div>
              <h3 className="text-xl font-semibold mb-2">Diet Friendly</h3>
              <p className="text-stone-600">
                Find keto, low-carb, high-protein options at any restaurant
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Data Section */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Highest Protein Meals Under 600 Calories
          </h2>
          <p className="text-center text-stone-600 mb-8">
            A preview of the insights you'll get
          </p>

          <div className="max-w-3xl mx-auto 
           rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <tbody className="divide-y divide-stone-200">
                {/* {topProteinMeals.map(meal => (
                  <MiniTableMealRow
                    key={meal.id}
                    meal={meal}
                    restaurantName={meal.restaurant.name}
                    restaurantSlug={meal.restaurant.slug}
                    showRestaurantData={true}
                    showCustomRow={false}
                    customRowKey=""
                    customRowUnits=""
                  />
                ))} */}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to find your healthy options?
          </h2>
          <Button size="lg" asChild>
            <Link href="/restaurants">
              Start Comparing Restaurants
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
} 