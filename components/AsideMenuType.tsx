"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"

interface AsideMenuTypeProps {
  restaurantSlug: string
  activeMenu: "full" | "low-carb" | "keto"
}

export function AsideMenuType({ restaurantSlug, activeMenu }: AsideMenuTypeProps) {
  const menuTypes = [
    { id: 'full', label: 'Full Menu', href: `/${restaurantSlug}` },
    { id: 'low-carb', label: 'Low-Carb Menu', href: `/${restaurantSlug}/low-carb` },
    { id: 'keto', label: 'Keto Menu', href: `/${restaurantSlug}/keto` },
  ] as const

  return (
    <section className="mt-6">
      <h3 className="text-stone-900 text-sm font-bold mb-2">Menu Type</h3>
      <div className="flex flex-col space-y-0">
        {menuTypes.map(({ id, label, href }) => {
          const isActive = activeMenu === id
          return (
            <div key={id} className="py-1">
              {isActive ? (
                <div className="px-1 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
                  {label}
                </div>
              ) : (
                <Link 
                  href={href}
                  className="px-1 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-md block hover:bg-stone-100"
                >
                  {label}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
} 