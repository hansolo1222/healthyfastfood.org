import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Youtube, Heart } from "lucide-react";

const navigation = {
  discover: [
    { name: 'All Restaurants', href: '/restaurants' },
    { name: 'Restaurant Types', href: '/restaurants' },
    { name: 'Meal Categories', href: '/category' },
    { name: 'High Protein Meals', href: '/meals?sort=protein' },
    { name: 'Low Calorie Options', href: '/meals?calories=0-400' },
    { name: 'Keto Friendly', href: '/keto' },
  ],
  popular: [
    { name: "McDonald's", href: '/mcdonalds' },
    { name: "Starbucks", href: '/starbucks' },
    { name: "Chick-fil-A", href: '/chick-fil-a' },
    { name: "Subway", href: '/subway' },
    { name: "Chipotle", href: '/chipotle' },
    { name: "Wendy's", href: '/wendys' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Donate', href: '/donate' },
  ],
  social: [
    {
      name: 'Facebook',
      href: 'https://facebook.com/healthyfastfoodorg',
      icon: Facebook,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/healthyfastfood',
      icon: Twitter,
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/healthyfastfood',
      icon: Instagram,
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/healthyfastfood',
      icon: Youtube,
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Stay Updated on Healthy Fast Food
            </h3>
            <p className="text-gray-400 mb-6">
              Get weekly tips, new restaurant updates, and exclusive nutrition insights.
            </p>
            <form className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              No spam, unsubscribe anytime. Read our{" "}
              <Link href="/privacy-policy" className="underline hover:text-gray-300">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Discover Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Discover</h4>
            <ul className="space-y-2">
              {navigation.discover.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Restaurants */}
          <div>
            <h4 className="font-semibold text-white mb-4">Popular Chains</h4>
            <ul className="space-y-2">
              {navigation.popular.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-white mb-4">HealthyFastFood</h4>
            <p className="text-sm mb-4">
              Making it easy to find nutritious options at every restaurant.
            </p>
            <div className="flex space-x-3">
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span>&copy; 2025 HealthyFastFood.org</span>
              <span className="text-gray-500">•</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="h-3 w-3 text-red-500" /> for healthy eaters
              </span>
            </div>
            <div className="flex gap-4 text-sm">
              <Link href="/sitemap.xml" className="hover:text-white transition-colors">
                Sitemap
              </Link>
              <Link href="/api" className="hover:text-white transition-colors">
                API
              </Link>
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 