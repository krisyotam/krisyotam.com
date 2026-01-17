"use client"

import { useTheme } from "next-themes"
import { Box } from "@/components/posts/typography/box"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from "recharts"

// Sample data - this will be replaced with real data from the Redis cache
const sampleData: VisitDataPoint[] = [
  { date: "2025-06-01", visits: 1200 },
  { date: "2025-06-08", visits: 1450 },
  { date: "2025-06-15", visits: 1300 },
  { date: "2025-06-22", visits: 1600 },
  { date: "2025-06-29", visits: 1750 },
  { date: "2025-07-01", visits: 1800 },
]

interface VisitDataPoint {
  date: string;
  visits: number;
}

export interface StatsChartProps {
  data?: VisitDataPoint[]
}

export function StatsChart({ data = sampleData }: StatsChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  
  const textColor = isDark ? "#A1A1AA" : "#71717A"
  const gridColor = isDark ? "#27272A" : "#E4E4E7"
  const lineColor = isDark ? "#14B8A6" : "#0D9488"

  return (
    <Box className="w-full">
      <h3 className="text-lg font-medium mb-4 text-center">Visitor Trends</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: textColor }} 
              tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <YAxis tick={{ fill: textColor }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? "#18181B" : "#FFFFFF",
                borderColor: isDark ? "#27272A" : "#E4E4E7",
                color: isDark ? "#E4E4E7" : "#18181B"
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="visits" 
              name="Daily Visitors"
              stroke={lineColor}
              strokeWidth={2}
              dot={{ fill: lineColor, r: 4 }}
              activeDot={{ fill: lineColor, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Box>
  )
}
