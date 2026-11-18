"use client";
import { useState } from "react";
import { BarChart2, RefreshCw, GitBranch, Sparkles } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import KPICard from "@/components/KPICard";
import { LineChartWidget, BarChartWidget, PieChartWidget } from "@/components/Charts";
import AIChat from "@/components/AIChat";
import DataTable from "@/components/DataTable";
import {
  ParsedData, analyzeData, buildDataSummary, getKPIs,
  getCategoryDistribution, getLineChartData,
} from "@/lib/dataUtils";

export default function Home() {
  const [data, setData] = useState<ParsedData | null>(null);
  const [activeLineCol, setActiveLineCol] = useState(0);
  const [activeBarCol, setActiveBarCol] = useState(0);

  const stats = data ? analyzeData(data) : {};
  const summary = data ? buildDataSummary(data, stats) : "";
  const kpis = data ? getKPIs(data, stats) : [];
  const lineData = data && data.numericColumns[activeLineCol]
    ? getLineChartData(data, data.numericColumns[activeLineCol]) : [];
  const barData = data && data.categoricalColumns[activeBarCol]
    ? getCategoryDistribution(data, data.categoricalColumns[activeBarCol]) : [];
  const pieData = data && data.categoricalColumns[0]
    ? getCategoryDistribution(data, data.categoricalColumns[0]) : [];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* nav */}
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <BarChart2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-100">InsightIQ</span>
            <span className="badge bg-brand-600/20 text-brand-400 border border-brand-500/30 ml-1">
              <Sparkles size={10} /> AI Powered
            </span>
          </div>
          <div className="flex items-center gap-3">
            {data && (
              <button onClick={() => setData(null)}
                className="btn-ghost flex items-center gap-1.5 text-sm py-1.5">
                <RefreshCw size={13} /> New Dataset
              </button>
            )}
            <a href="https://github.com/Pushpendra33" target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
              <GitBranch size={14} /> GitHub
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!data ? (
          /* ── LANDING ── */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 badge bg-brand-600/10 border border-brand-500/20 text-brand-400 mb-4 px-3 py-1.5 text-xs">
                <Sparkles size={12} /> Powered by Claude AI
              </div>
              <h1 className="text-4xl font-bold text-gray-100 mb-3">
                Turn your data into <span className="text-brand-400">smart insights</span>
              </h1>
              <p className="text-gray-500 text-base">
                Upload any CSV — get instant charts, KPIs, and an AI analyst you can talk to.
              </p>
            </div>
            <FileUpload onData={setData} />

            {/* demo hint */}
            <p className="text-center text-xs text-gray-600 mt-6">
              No CSV handy? Try with any sales, user, or financial data export.
            </p>
          </div>
        ) : (
          /* ── DASHBOARD ── */
          <div className="space-y-6">
            {/* header */}
            <div>
              <h2 className="text-xl font-bold text-gray-100">Dashboard</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {data.rowCount} rows · {data.columns.length} columns ·{" "}
                {data.numericColumns.length} numeric · {data.categoricalColumns.length} categorical
              </p>
            </div>

            {/* KPIs */}
            {kpis.length > 0 && (
              <div className={`grid gap-4 ${kpis.length === 1 ? "grid-cols-1" : kpis.length === 2 ? "grid-cols-2" : kpis.length === 3 ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}>
                {kpis.map((k, i) => (
                  <KPICard key={k.label} label={k.label} value={k.value}
                    avg={k.avg} min={k.min} max={k.max} color={String(i)} />
                ))}
              </div>
            )}

            {/* charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* line chart */}
              {data.numericColumns.length > 0 && (
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-semibold text-sm">Trend over rows</p>
                    {data.numericColumns.length > 1 && (
                      <select className="text-xs bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-gray-300"
                        value={activeLineCol} onChange={e => setActiveLineCol(Number(e.target.value))}>
                        {data.numericColumns.map((c, i) => <option key={c} value={i}>{c}</option>)}
                      </select>
                    )}
                  </div>
                  <LineChartWidget data={lineData} label={data.numericColumns[activeLineCol]} />
                </div>
              )}

              {/* pie chart */}
              {pieData.length > 0 && (
                <div className="card">
                  <p className="font-semibold text-sm mb-4">
                    Distribution — <span className="text-gray-400">{data.categoricalColumns[0]}</span>
                  </p>
                  <PieChartWidget data={pieData} />
                </div>
              )}
            </div>

            {/* bar chart + AI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {barData.length > 0 && (
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-semibold text-sm">Category Breakdown</p>
                    {data.categoricalColumns.length > 1 && (
                      <select className="text-xs bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-gray-300"
                        value={activeBarCol} onChange={e => setActiveBarCol(Number(e.target.value))}>
                        {data.categoricalColumns.map((c, i) => <option key={c} value={i}>{c}</option>)}
                      </select>
                    )}
                  </div>
                  <BarChartWidget data={barData} label={data.categoricalColumns[activeBarCol]} />
                </div>
              )}
              <AIChat columns={data.columns} dataSummary={summary} rowCount={data.rowCount} />
            </div>

            {/* table */}
            <DataTable columns={data.columns} rows={data.rows} />
          </div>
        )}
      </main>
    </div>
  );
}
