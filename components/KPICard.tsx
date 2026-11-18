"use client";
import { formatNumber } from "@/lib/dataUtils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  label: string;
  value: number;
  avg: number;
  min: number;
  max: number;
  color: string;
}

const COLORS = [
  { bg: "from-blue-600/20 to-blue-500/5", border: "border-blue-500/30", text: "text-blue-400" },
  { bg: "from-purple-600/20 to-purple-500/5", border: "border-purple-500/30", text: "text-purple-400" },
  { bg: "from-emerald-600/20 to-emerald-500/5", border: "border-emerald-500/30", text: "text-emerald-400" },
  { bg: "from-amber-600/20 to-amber-500/5", border: "border-amber-500/30", text: "text-amber-400" },
];

export default function KPICard({ label, value, avg, min, max, color }: Props) {
  const c = COLORS[Number(color) % COLORS.length];
  const trend = value > avg * 1.1 ? "up" : value < avg * 0.9 ? "down" : "flat";

  return (
    <div className={`card bg-gradient-to-br ${c.bg} border ${c.border} flex flex-col gap-2`}>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider truncate">{label}</p>
      <p className={`text-3xl font-bold ${c.text}`}>{formatNumber(value)}</p>
      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
        <span>Avg: {formatNumber(avg)}</span>
        <span className="flex items-center gap-1">
          {trend === "up" && <TrendingUp size={12} className="text-emerald-400" />}
          {trend === "down" && <TrendingDown size={12} className="text-red-400" />}
          {trend === "flat" && <Minus size={12} className="text-gray-500" />}
          <span>Min {formatNumber(min)} · Max {formatNumber(max)}</span>
        </span>
      </div>
    </div>
  );
}
