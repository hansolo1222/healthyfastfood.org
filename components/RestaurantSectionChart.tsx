"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts'
import { useState, useEffect } from 'react'
import { RestaurantSectionChartAxisSelection, X_AXIS_OPTIONS } from './RestaurantSectionChartAxisSelection'
import { RestaurantSectionChartControls } from './RestaurantSectionChartControls'
import { calculateCustomNutrition, getCustomNutritionRowInfo } from './utils'
import { Y_AXIS_OPTIONS } from './RestaurantSectionChartAxisSelection'

// Define a color palette array instead of an object
const CATEGORY_COLORS = [
  "#2563eb",  // blue-600
  "#dc2626",  // red-600
  "#16a34a",  // green-600
  "#9333ea",  // purple-600
  "#ea580c",  // orange-600
  "#0891b2",  // cyan-600
  "#db2777",  // pink-600
  "#d97706",  // amber-600
  "#4f46e5",  // indigo-600
  "#059669",  // emerald-600
] as const

interface ChartProps {
  categoryName: string | null
  items: any[]
  restaurant: any
  showRestaurantData: boolean
  xAxis: string
  yAxis: string
  showLabels: boolean
}

function CategoryChart({ 
  categoryName, 
  items,
  restaurant,
  showRestaurantData,
  xAxis,
  yAxis,
  showLabels
}: ChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const processedData = items.map(item => ({
      name: item.name,
      calories: item.calories,
      protein: parseFloat(item.protein) || 0,
      totalCarbohydrates: parseFloat(item.totalCarbohydrates) || 0,
      totalFat: parseFloat(item.totalFat) || 0,
      cholesterol: parseFloat(item.cholesterol) || 0,
      sodium: parseFloat(item.sodium) || 0,
      sugar: parseFloat(item.sugar) || 0,
      category: item.categoryName,
      restaurant: restaurant.name,
      slug: item.slug,
      customValue: parseFloat(calculateCustomNutrition(yAxis, item)) || 0
    }));
    setChartData(processedData);
  }, [items, yAxis, restaurant.name]);

  if (!chartData.length) return null;

  // Get unique categories and create a mapping of category to color index
  const uniqueCategories = Array.from(new Set(items.map(item => item.categoryName)));
  const categoryColorMap = Object.fromEntries(
    uniqueCategories.map((category, index) => [
      category, 
      CATEGORY_COLORS[index % CATEGORY_COLORS.length]
    ])
  );

  console.log(showLabels, "show labels")

  return (
    <div className="h-[600px] w-full bg-white p-4 rounded-lg">
      <h3 className="text-base font-medium mb-4">{categoryName || "All Items"}</h3>
      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey={xAxis}
            name={xAxis}
            label={{ value: xAxis, position: "bottom", offset: 20 }}
          />
          <YAxis 
            type="number" 
            dataKey="customValue"
            name={yAxis}
            label={{ 
              value: getCustomNutritionRowInfo(yAxis).title, 
              angle: -90, 
              position: "insideLeft", 
              offset: 10 
            }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                const xAxisValue = data[xAxis];
                const yAxisValue = data.customValue;
                
                // Get the display info for the Y axis
                const yAxisInfo = getCustomNutritionRowInfo(yAxis);
                
                return (
                  <div className="bg-white p-2 border rounded-lg shadow-lg">
                    <p className="font-medium">{data.name}</p>
                    {/* Always show calories as reference */}
                     
                    {/* Show selected X and Y axis values */}
                    <p>{X_AXIS_OPTIONS.find(opt => opt.name === xAxis)?.label}: {xAxisValue}{getUnitForAxis(xAxis)}</p>
                    <p>{yAxisInfo.title}: {yAxisValue}{yAxisInfo.units}</p>
                    
                    {showRestaurantData && (
                      <>
                        <p className="text-stone-500">Category: {data.category}</p>
                        <p className="text-stone-500">Restaurant: {data.restaurant}</p>
                      </>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          {!categoryName && <Legend />}
          {categoryName ? (
            <Scatter
              name={categoryName}
              data={chartData}
              fill={categoryColorMap[categoryName] || "#666666"}
            >
              {showLabels && (
                <LabelList
                  dataKey="name"
                  position="right"
                  offset={10}
                  content={(props: any) => {
                    const { x, y, value } = props;
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#666666"
                        fontSize="11px"
                        textAnchor="start"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {value}
                      </text>
                    );
                  }}
                />
              )}
            </Scatter>
          ) : (
            // Multiple categories in one chart
            Object.entries(
              chartData.reduce((acc, item) => {
                const category = item.category;
                if (!acc[category]) acc[category] = [];
                acc[category].push(item);
                return acc;
              }, {})
            ).map(([category, items]) => (
              <Scatter
                key={category}
                name={category}
                data={items as any[]}
                fill={categoryColorMap[category] || "#666666"}
              >
                {showLabels && (
                <LabelList
                  dataKey="name"
                  position="right"
                  offset={10}
                  content={(props: any) => {
                    const { x, y, value } = props;
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#666666"
                        fontSize="11px"
                        textAnchor="start"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {value}
                      </text>
                    );
                  }}
                />
              )}
              </Scatter>
            ))
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

interface RestaurantSectionChartProps {
  restaurant: any
  categoriesWithParents: any[]
  umbrellaCategories: string[]
  getUmbrellaCategory: (category: string) => string
  items: any[]
  showRestaurantData: boolean
  isGrouped: boolean
  yAxis: string
  setThematicFilter: (prev: any) => void
}

export function RestaurantSectionChart({
  restaurant,
  categoriesWithParents,
  umbrellaCategories,
  getUmbrellaCategory,
  items,
  showRestaurantData,
  isGrouped,
  yAxis,
  setThematicFilter 
}: RestaurantSectionChartProps) {
  const [xAxis, setXAxis] = useState("calories")
  const [showLabels, setShowLabels] = useState(false)

  const STANDARD_FIELDS = ['calories', 'protein', 'totalCarbohydrates', 'totalFat', 'cholesterol', 'sodium', 'sugar'];

  return (
    <section className="mt-6 space-y-4">
      <RestaurantSectionChartAxisSelection
        xAxis={xAxis}
        yAxis={yAxis}
        onXAxisChange={setXAxis}
        onYAxisChange={(axis) => setThematicFilter(prev => ({
          ...prev,
          thematicFilter: STANDARD_FIELDS.includes(axis) ? undefined : axis
        }))}
      />
      <RestaurantSectionChartControls
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels(prev => !prev)}
      />
      {isGrouped ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {categoriesWithParents
            .filter((cat) => umbrellaCategories.includes(getUmbrellaCategory(cat.parentCategory)))
            .map((category) => {
              const categoryItems = items.filter(item => item.categoryName === category.categoryName)
              if (categoryItems.length === 0) return null

              return (
                <div key={category.categoryName} className="border rounded-lg bg-white">
                  <CategoryChart
                    categoryName={category.categoryName}
                    items={categoryItems}
                    restaurant={restaurant}
                    showRestaurantData={showRestaurantData}
                    xAxis={xAxis}
                    yAxis={yAxis}
                    showLabels={showLabels}
                  />
                </div>
              )
            })}
        </div>
      ) : (
        <div className="border rounded-lg bg-white">
          <CategoryChart
            categoryName={null}
            items={items}
            restaurant={restaurant}
            showRestaurantData={showRestaurantData}
            xAxis={xAxis}
            yAxis={yAxis}
            showLabels={showLabels}
          />
        </div>
      )}
    </section>
  )
}

function getUnitForAxis(axis: string): string {
  switch (axis) {
    case 'protein':
    case 'totalCarbohydrates':
    case 'totalFat':
    case 'fiber':
      return 'g';
    case 'sodium':
    case 'cholesterol':
      return 'mg';
    case 'calories':
      return '';
    default:
      return '';
  }
}