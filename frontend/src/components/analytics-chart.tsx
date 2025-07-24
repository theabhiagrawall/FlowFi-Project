'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
    sent: {
      label: "Sent",
      color: "hsl(var(--primary))",
    },
    received: {
      label: "Received",
      color: "hsl(var(--accent))",
    },
  } satisfies ChartConfig

export default function AnalyticsChart() {
    return (
        <div className="h-[400px]">
            <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={analyticsData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                     <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip
                        content={<ChartTooltipContent />}
                    />
                    <Legend />
                    <Bar dataKey="sent" fill="var(--color-sent)" radius={4} />
                    <Bar dataKey="received" fill="var(--color-received)" radius={4} />
                </BarChart>
            </ChartContainer>
        </div>
    );
}
