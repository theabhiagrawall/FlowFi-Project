'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// A larger, more vibrant color palette for the pie chart slices
const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF',
    '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'
];

// A custom tooltip for a cleaner look and feel
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const formattedValue = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(data.value);

        return (
            <div className="rounded-lg border bg-background p-2.5 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col space-y-1.5">
                        <span className="text-sm text-muted-foreground">{data.name}</span>
                        <span className="font-bold">{formattedValue}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function SpendingPieChart({ data }) {
    // If there's no data or it's an empty array, display a message.
    if (!data || data.length === 0) {
        return (
            <div className="h-[350px] flex justify-center items-center text-muted-foreground">
                <p>No spending data available for this period.</p>
            </div>
        );
    }

    // Map the incoming data to the format recharts expects ('name' and 'value')
    const chartData = data.map(item => ({
        name: item.category,
        value: item.amount
    }));

    return (
        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                            return (percent * 100) > 5 ? ( // Only show label if slice is > 5%
                                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
                                    {`${(percent * 100).toFixed(0)}%`}
                                </text>
                            ) : null;
                        }}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconSize={10} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
