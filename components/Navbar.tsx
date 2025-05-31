"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown,
  Utensils,
  Store,
  Coffee,
  Pizza,
  Beef,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const popularRestaurants = [
  { name: "McDonald's", href: "/mcdonalds", icon: "🍔" },
  { name: "Starbucks", href: "/starbucks", icon: "☕" },
  { name: "Chick-fil-A", href: "/chick-fil-a", icon: "🐔" },
  { name: "Taco Bell", href: "/taco-bell", icon: "🌮" },
  { name: "Wendy's", href: "/wendys", icon: "🍔" },
  { name: "Burger King", href: "/burger-king", icon: "👑" },
  { name: "Subway", href: "/subway", icon: "🥖" },
  { name: "Chipotle", href: "/chipotle", icon: "🌯" },
];

const restaurantTypes = [
  { name: "Burger Chains", href: "/restaurants/hamburgers", icon: <Beef className="w-4 h-4" /> },
  { name: "Coffee & Beverages", href: "/restaurants/beverages", icon: <Coffee className="w-4 h-4" /> },
  { name: "Pizza Places", href: "/restaurants/pizza", icon: <Pizza className="w-4 h-4" /> },
  { name: "Mexican", href: "/restaurants/mexican-tex-mex", icon: "🌮" },
  { name: "Asian", href: "/restaurants/asian", icon: "🥡" },
  { name: "Chicken", href: "/restaurants/chicken", icon: "🍗" },
];

const categories = [
  { name: "Burgers & Sandwiches", href: "/category/burgers-sandwiches" },
  { name: "Salads", href: "/category/salads" },
  { name: "Pizza", href: "/category/pizzas" },
  { name: "Tacos & Burritos", href: "/category/tacos" },
  { name: "Breakfast", href: "/category/breakfast" },
  { name: "Desserts", href: "/category/desserts" },
];

const DiscordIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      " z-50 w-full transition-all duration-200",
      isScrolled ? " backdrop-blur shadow-sm" : " "
    )}>
      <nav className=" px-2 md:px-8">
        <div className="flex md:h-14 h-12 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/images/mark.svg"
                alt="HealthyFastFood"
                className="h-8 w-8"
              />
              <span className="hidden md:block font-semibold text-md">
                healthyfastfood.org
              </span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {/* Restaurants Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Restaurants</NavigationMenuTrigger>
                  <NavigationMenuContent className="z-[120]">
                    <div className="grid gap-3 p-6 w-[600px] grid-cols-2">
                      <div>
                        <h3 className="font-semibold mb-3 text-sm text-gray-500">Popular Chains</h3>
                        <ul className="space-y-2">
                          {popularRestaurants.map((restaurant) => (
                            <li key={restaurant.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={restaurant.href}
                                  className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100 transition-colors"
                                >
                                  <span className="text-lg">{restaurant.icon}</span>
                                  <span className="text-sm">{restaurant.name}</span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3 text-sm text-gray-500">By Type</h3>
                        <ul className="space-y-2">
                          {restaurantTypes.map((type) => (
                            <li key={type.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={type.href}
                                  className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100 transition-colors"
                                >
                                  {typeof type.icon === 'string' ? (
                                    <span className="text-lg">{type.icon}</span>
                                  ) : (
                                    type.icon
                                  )}
                                  <span className="text-sm">{type.name}</span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                href="/restaurants"
                                className="flex items-center gap-2 rounded-md p-2 text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                              >
                                <Store className="w-4 h-4" />
                                <span className="text-sm">View All Restaurants</span>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Categories Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 grid-cols-2">
                      {categories.map((category) => (
                        <li key={category.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={category.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                            >
                              <div className="text-sm font-medium leading-none">
                                {category.name}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li className="col-span-2">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/category"
                            className="flex items-center gap-2 rounded-md p-3 text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                          >
                            <Utensils className="w-4 h-4" />
                            <span className="text-sm">All Categories</span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Direct Links */}
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => router.push('/explore')}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* CTA Button */}
            <Button asChild className="hidden md:flex">
              <Link href="/explore">
                Find Healthy Options
              </Link>
            </Button>

            {/* Discord link for desktop */}
            <a
              href="https://discord.gg/yxFKFFVd7P"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Join our Discord"
            >
              <DiscordIcon />
            </a>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const query = e.currentTarget.search.value;
                  router.push(`/explore?q=${encodeURIComponent(query)}`);
                }}>
                  <input
                    name="search"
                    type="text"
                    placeholder="Search restaurants or meals..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </form>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-2">Popular Restaurants</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {popularRestaurants.slice(0, 6).map((restaurant) => (
                      <Link
                        key={restaurant.href}
                        href={restaurant.href}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <span>{restaurant.icon}</span>
                        <span className="text-sm">{restaurant.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Link
                    href="/restaurants"
                    className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    View All Restaurants
                  </Link>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <Link
                    href="/category"
                    className="block py-2 px-4 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    All Categories
                  </Link>
                  <Link
                    href="/about"
                    className="block py-2 px-4 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                </div>
              </div>

              {/* Discord link for mobile - always visible */}
              <a
                href="https://discord.gg/yxFKFFVd7P"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Join our Discord"
              >
                <DiscordIcon />
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
