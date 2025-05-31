"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Search, TrendingUp, Users, Utensils, Filter, ChevronRight, Zap, Leaf, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomeClient({ 
  restaurants,
  categories,
  stats,
  popularHealthyMeals,
  recentSearches
}) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Redirect to explore page with search query
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      // If no query, just go to explore page
      router.push('/explore')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - More Dynamic */}
      <section className="relative bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats.totalMeals.toLocaleString()} meals analyzed
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Find Healthy Fast Food
              <span className="block text-3xl md:text-4xl mt-2 text-gray-600 font-normal">
                in seconds, not hours
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Search {stats.totalRestaurants}+ restaurants and {stats.totalMeals.toLocaleString()} menu items. 
              Filter by nutrition, allergens, and dietary preferences.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Try 'McDonald's high protein' or 'Chipotle keto'..."
                  className="pl-12 pr-32 py-6 text-lg rounded-full shadow-lg border-2 focus:border-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <Link href="/explore?quickFilter=low-calorie" className="group">
                <div className="bg-white rounded-lg p-4 shadow-sm group-hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-2xl font-bold text-green-600">{stats.lowCalorieMeals}</div>
                  <div className="text-sm text-gray-600">Under 500 cal</div>
                </div>
              </Link>
              <Link href="/explore?quickFilter=high-protein" className="group">
                <div className="bg-white rounded-lg p-4 shadow-sm group-hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-2xl font-bold text-blue-600">{stats.highProteinMeals}</div>
                  <div className="text-sm text-gray-600">30g+ protein</div>
                </div>
              </Link>
              <Link href="/explore" className="group">
                <div className="bg-white rounded-lg p-4 shadow-sm group-hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-2xl font-bold text-purple-600">8</div>
                  <div className="text-sm text-gray-600">Diet filters</div>
                </div>
              </Link>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-orange-600">24/7</div>
                <div className="text-sm text-gray-600">Updated data</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Searches */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="text-sm text-gray-500">Popular:</span>
            {recentSearches.map((search, idx) => (
              <Link 
                key={idx}
                href={`/explore?q=${encodeURIComponent(search)}`}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                {search}
              </Link>
            ))}
            <Link 
              href="/explore"
              className="text-sm font-medium text-green-600 hover:text-green-800 hover:underline"
            >
              Explore all →
            </Link>
          </div>
        </div>
      </section>

      {/* Restaurant Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Browse Restaurants</h2>
              <p className="text-gray-600">Click any restaurant to see full nutrition data</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/restaurants">
                View all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/${restaurant.slug}`}
                className="group bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <Image
                    src={`/images/logosSmall/${restaurant.slug}.webp`}
                    alt={restaurant.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-semibold text-center group-hover:text-blue-600 transition-colors">
                  {restaurant.name}
                </h3>
                <p className="text-sm text-gray-500 text-center mt-1">
                  {restaurant._count.meals} items
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Healthy Picks Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Today's Healthy Picks</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              High-protein, moderate-calorie meals from popular restaurants
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {popularHealthyMeals.map((meal) => (
              <Link
                key={meal.id}
                href={`/${meal.restaurant.slug}/${meal.slug}`}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                      {meal.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{meal.restaurant.name}</p>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {meal.category.name}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center mt-4 pt-4 border-t">
                  <div>
                    <div className="text-lg font-semibold">{meal.calories}</div>
                    <div className="text-xs text-gray-500">calories</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">{meal.protein}g</div>
                    <div className="text-xs text-gray-500">protein</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{meal.totalCarbohydrates}g</div>
                    <div className="text-xs text-gray-500">carbs</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/meals?sort=proteinPerCalorie">
                Explore more healthy options
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to eat smarter
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Filters</h3>
              <p className="text-gray-600">
                Filter by calories, macros, allergens, and dietary preferences instantly
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Data</h3>
              <p className="text-gray-600">
                Updated nutrition info from official restaurant sources
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Diet Modes</h3>
              <p className="text-gray-600">
                Pre-filtered views for keto, low-carb, vegan, and more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start making healthier choices today
          </h2>
          <p className="text-xl mb-8 text-green-50 max-w-2xl mx-auto">
            Join thousands who use HealthyFastFood to find nutritious meals at their favorite restaurants
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/restaurants">
                Browse Restaurants
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20" asChild>
              <Link href="/categories">
                Explore by Category
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 