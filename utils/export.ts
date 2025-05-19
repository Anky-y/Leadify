import { TwitchData } from "@/components/twitch-scraper/types";
import * as XLSX from "xlsx";
function exportToCSV(data: TwitchData[], filename: string) {
  const replacer = (_key: string, value: any) => (value === null ? "" : value);
  const header = Object.keys(data[0] || {}) as (keyof TwitchData)[];
  const csv = [
    header.join(","),
    ...data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    ),
  ].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToJSON(data: TwitchData[], filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToExcel(data: TwitchData[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "TwitchData");
  XLSX.writeFile(workbook, filename);
}
export { exportToCSV, exportToJSON, exportToExcel };
