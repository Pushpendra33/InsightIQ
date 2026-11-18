"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props { columns: string[]; rows: Record<string, string | number>[]; }

export default function DataTable({ columns, rows }: Props) {
  const [page, setPage] = useState(0);
  const PER_PAGE = 8;
  const total = Math.ceil(rows.length / PER_PAGE);
  const slice = rows.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-sm">Raw Data <span className="text-gray-500 text-xs ml-1">({rows.length} rows)</span></p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{page + 1} / {total}</span>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="p-1 rounded hover:bg-gray-700 disabled:opacity-30 transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => setPage(p => Math.min(total - 1, p + 1))} disabled={page === total - 1}
            className="p-1 rounded hover:bg-gray-700 disabled:opacity-30 transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-800">
              {columns.map(c => (
                <th key={c} className="text-left py-2 px-3 text-gray-500 font-medium whitespace-nowrap">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((row, i) => (
              <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                {columns.map(c => (
                  <td key={c} className="py-2 px-3 text-gray-300 whitespace-nowrap max-w-[160px] truncate">
                    {String(row[c] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
