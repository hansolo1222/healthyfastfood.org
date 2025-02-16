"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, ListIcon } from "lucide-react"

interface RestaurantSectionTabsProps {
  view: "list" | "chart"
  onChange: (view: "list" | "chart") => void
}

export function RestaurantSectionTabs({
  view,
  onChange
}: RestaurantSectionTabsProps) {
  return (
    <Tabs value={view} onValueChange={onChange as any} className="mb-4 mt-4 border-b py-[9px]">
      <TabsList className="bg-transparent  w-full justify-start p-0">
        <TabsTrigger 
          value="list" 
          className={`py-4 !bg-transparent rounded-none !shadow-none flex items-center gap-2 ${view === 'list' ? '!text-pink-500 font-bold border-b-2 border-pink-500' : ''}`}
        >
          <ListIcon className="w-4 h-4" />
          List View
        </TabsTrigger>
        <TabsTrigger 
          value="chart" 
          className={`py-4 !bg-transparent rounded-none !shadow-none flex items-center gap-2 ${view === 'chart' ? '!text-pink-500 font-bold border-b-2 border-pink-500' : ''}`}
        >
          <BarChart className="w-4 h-4" />
          Chart View
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}