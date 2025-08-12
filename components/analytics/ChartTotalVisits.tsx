'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

export function ChartTotalVisits({ data }: { data: { date: string; total: number }[] }) {
  const CustomTooltip = ({ active, payload }: any) =>
    active && payload?.length ? (
      <div className="rounded-lg border bg-card p-2 shadow-sm">
        <p className="font-bold">{payload[0].payload.date}</p>
        <p>{payload[0].value} page visits</p>
      </div>
    ) : null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="total" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
