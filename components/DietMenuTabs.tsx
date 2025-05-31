"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, usePathname } from "next/navigation"

interface DietMenuTabsProps {
  restaurantSlug: string
}

export function DietMenuTabs({ restaurantSlug }: DietMenuTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // Determine active tab based on current path
  const getActiveTab = () => {
    if (pathname.includes('/keto')) return 'keto'
    if (pathname.includes('/low-carb')) return 'low-carb'
    return 'full'
  }

  const activeTab = getActiveTab()

  const menuTypes = [
    { id: 'full', label: 'Full Menu', href: `/${restaurantSlug}` },
    { id: 'low-carb', label: 'Low-Carb', href: `/${restaurantSlug}/low-carb` },
    { id: 'keto', label: 'Keto', href: `/${restaurantSlug}/keto` },
  ]

  const handleTabChange = (value: string) => {
    const menuType = menuTypes.find(type => type.id === value)
    if (menuType) {
      router.push(menuType.href)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-2 mt02 md:mb-4 md:mt-4 border-b px-2 md:px-0">
      <TabsList className="bg-transparent w-full justify-start p-0 h-auto space-x-6">
        {menuTypes.map(({ id, label }) => (
          <TabsTrigger 
            key={id}
            value={id} 
            className={`
              py-3 px-0 !bg-transparent rounded-none !shadow-none 
              text-sm font-medium transition-colors duration-200
              ${activeTab === id 
                ? '!text-red-600 font-semibold border-b-2 border-red-600' 
                : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
              }
            `}
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
} 