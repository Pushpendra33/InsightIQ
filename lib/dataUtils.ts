export interface ParsedData {
  columns: string[];
  rows: Record<string, string | number>[];
  numericColumns: string[];
  categoricalColumns: string[];
  rowCount: number;
}

export interface ColumnStats {
  min: number;
  max: number;
  avg: number;
  sum: number;
}

export function analyzeData(data: ParsedData): Record<string, ColumnStats> {
  const stats: Record<string, ColumnStats> = {};
  for (const col of data.numericColumns) {
    const vals = data.rows
      .map((r) => Number(r[col]))
      .filter((v) => !isNaN(v));
    if (vals.length === 0) continue;
    stats[col] = {
      min: Math.min(...vals),
      max: Math.max(...vals),
      avg: vals.reduce((a, b) => a + b, 0) / vals.length,
      sum: vals.reduce((a, b) => a + b, 0),
    };
  }
  return stats;
}

export function buildDataSummary(data: ParsedData, stats: Record<string, ColumnStats>): string {
  const lines: string[] = [`Dataset has ${data.rowCount} rows and ${data.columns.length} columns.`];

  if (data.numericColumns.length > 0) {
    lines.push("Numeric columns:");
    for (const col of data.numericColumns) {
      const s = stats[col];
      if (!s) continue;
      lines.push(
        `  ${col}: min=${s.min.toFixed(2)}, max=${s.max.toFixed(2)}, avg=${s.avg.toFixed(2)}, sum=${s.sum.toFixed(2)}`
      );
    }
  }

  if (data.categoricalColumns.length > 0) {
    lines.push("Categorical columns:");
    for (const col of data.categoricalColumns) {
      const freq: Record<string, number> = {};
      data.rows.forEach((r) => {
        const v = String(r[col]);
        freq[v] = (freq[v] || 0) + 1;
      });
      const top = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([k, v]) => `${k}(${v})`)
        .join(", ");
      lines.push(`  ${col}: top values — ${top}`);
    }
  }

  // include first 3 rows as sample
  lines.push("Sample rows: " + JSON.stringify(data.rows.slice(0, 3)));
  return lines.join("\n");
}

export function getKPIs(data: ParsedData, stats: Record<string, ColumnStats>) {
  return data.numericColumns.slice(0, 4).map((col) => ({
    label: col,
    value: stats[col]?.sum ?? 0,
    avg: stats[col]?.avg ?? 0,
    min: stats[col]?.min ?? 0,
    max: stats[col]?.max ?? 0,
  }));
}

export function getCategoryDistribution(data: ParsedData, col: string) {
  const freq: Record<string, number> = {};
  data.rows.forEach((r) => {
    const v = String(r[col]);
    freq[v] = (freq[v] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));
}

export function getLineChartData(data: ParsedData, yCol: string) {
  return data.rows.slice(0, 50).map((row, i) => ({
    index: i + 1,
    value: Number(row[yCol]) || 0,
  }));
}

export function formatNumber(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toFixed(2);
}
