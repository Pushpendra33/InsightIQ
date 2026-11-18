"use client";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#06b6d4","#f97316","#ec4899"];

const tooltipStyle = {
  contentStyle: { background: "#111827", border: "1px solid #374151", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "#9ca3af" },
};

interface LineProps { data: { index: number; value: number }[]; label: string; }
export function LineChartWidget({ data, label }: LineProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="index" tick={{ fontSize: 11, fill: "#6b7280" }} />
        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
        <Tooltip {...tooltipStyle} />
        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2}
          dot={false} name={label} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface BarProps { data: { name: string; value: number }[]; label: string; }
export function BarChartWidget({ data, label }: BarProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} angle={-30} textAnchor="end" />
        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="value" name={label} radius={[4,4,0,0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface PieProps { data: { name: string; value: number }[]; }
export function PieChartWidget({ data }: PieProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={false}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
