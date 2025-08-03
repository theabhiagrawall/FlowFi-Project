'use client';

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Rent', value: 400 },
  { name: 'Groceries', value: 300 },
  { name: 'Utilities', value: 200 },
  { name: 'Entertainment', value: 100 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function SpendingPieChart() {
  return (
    <PieChart width={400} height={350}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={120}
        fill="#8884d8"
        dataKey="value"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
