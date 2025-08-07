'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart.jsx';
import { format } from 'date-fns';

const chartConfig = {
    sent: {
        label: "Sent",
        color: "hsl(var(--destructive))", // Using destructive color for 'sent'
    },
    received: {
        label: "Received",
        color: "hsl(var(--primary))", // Using primary color for 'received'
    },
};

// This component now accepts a 'data' prop from its parent (AnalyticsPage)
export default function AnalyticsChart({ data }) {
    // Provide a fallback to an empty array if data is not yet available
    const chartData = data || [];

    return (
        <div className="h-[350px]">
            <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={chartData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        stroke="#888888"
                        fontSize={12}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        stroke="#888888"
                        fontSize={12}
                        tickFormatter={(value) => `₹${value / 1000}k`} // Format large numbers
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Legend />
                    <Bar dataKey="sent" fill="var(--color-sent)" radius={4} />
                    <Bar dataKey="received" fill="var(--color-received)" radius={4} />
                </BarChart>
            </ChartContainer>
        </div>
    );
}
