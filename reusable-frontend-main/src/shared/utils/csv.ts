export type CsvValue = string | number | boolean | null | undefined | Date;

function escapeCsvValue(value: CsvValue): string {
  if (value === null || value === undefined) return "";
  const text = value instanceof Date ? value.toISOString() : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function toCsv(rows: CsvValue[][]): string {
  return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
}

export function downloadCsv(
  filename: string,
  rows: CsvValue[][],
  options: { bom?: boolean } = {}
): void {
  const csv = toCsv(rows);
  const prefix = options.bom === false ? "" : "\uFEFF";
  const blob = new Blob([prefix + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
