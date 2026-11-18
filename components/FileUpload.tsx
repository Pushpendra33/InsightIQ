"use client";
import { useCallback, useState } from "react";
import Papa from "papaparse";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { ParsedData } from "@/lib/dataUtils";

interface Props { onData: (data: ParsedData) => void; }

export default function FileUpload({ onData }: Props) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const processFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) { setError("Please upload a CSV file."); return; }
    setError("");
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const columns = results.meta.fields ?? [];
        const rows = results.data as Record<string, string | number>[];
        if (rows.length === 0) { setError("CSV appears to be empty."); return; }
        const numericColumns = columns.filter(col =>
          rows.slice(0, 20).every(r => r[col] === "" || r[col] === null || !isNaN(Number(r[col])))
        );
        const categoricalColumns = columns.filter(c => !numericColumns.includes(c));
        onData({ columns, rows, numericColumns, categoricalColumns, rowCount: rows.length });
      },
      error: () => setError("Failed to parse CSV. Check your file format."),
    });
  }, [onData]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
        ${dragging ? "border-brand-500 bg-brand-600/10" : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/40"}`}
      onClick={() => document.getElementById("csv-input")?.click()}
    >
      <input id="csv-input" type="file" accept=".csv" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
      <div className="w-16 h-16 rounded-2xl bg-brand-600/20 flex items-center justify-center mx-auto mb-4">
        <Upload size={28} className="text-brand-400" />
      </div>
      <p className="text-lg font-semibold text-gray-200 mb-1">Drop your CSV here</p>
      <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
      <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
        <FileText size={12} /> <span>CSV files only · any size</span>
      </div>
      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-400 text-sm justify-center">
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  );
}
