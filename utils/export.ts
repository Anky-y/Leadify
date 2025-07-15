import { useUser } from "@/app/context/UserContext";
import * as XLSX from "xlsx";

const { user } = useUser();

// Helper function to filter object properties based on column visibility
export function filterObjectByColumns(
  obj: any,
  columnVisibility: Record<string, boolean>
): any {
  const columnToPropertyMap: Record<string, string> = {
    username: "username",
    followers: "followers",
    viewers: "viewer_count",
    language: "language",
    category: "game_name",
    social: "social",
    email: "gmail",
    date: "saved_at",
    // folder and is_favourite are intentionally omitted
  };

  const filteredObj: any = {};

  Object.entries(columnVisibility).forEach(([column, isVisible]) => {
    if (isVisible && columnToPropertyMap[column]) {
      const property = columnToPropertyMap[column];

      if (column === "social") {
        if (obj.discord) filteredObj.discord = obj.discord;
        if (obj.youtube) filteredObj.youtube = obj.youtube;
        if (obj.twitter) filteredObj.twitter = obj.twitter;
        if (obj.facebook) filteredObj.facebook = obj.facebook;
        if (obj.instagram) filteredObj.instagram = obj.instagram;
      } else {
        if (obj[property] !== undefined) {
          filteredObj[property] = obj[property];
        }
      }
    }
  });

  if (obj.channelUrl) filteredObj.channelUrl = obj.channelUrl;

  return filteredObj;
}

export function exportToCSV(
  data: any[],
  filename: string,
  columnVisibility?: Record<string, boolean>
) {
  // Filter data by columns if columnVisibility is provided

  const exportData = columnVisibility
    ? data.map((item) => filterObjectByColumns(item, columnVisibility))
    : data;

  uploadExportData(exportData, user?.id, filename, "csv");
  const csvContent = convertToCSV(exportData);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(
  data: any[],
  filename: string,
  columnVisibility?: Record<string, boolean>
) {
  // Filter data by columns if columnVisibility is provided
  const exportData = columnVisibility
    ? data.map((item) => filterObjectByColumns(item, columnVisibility))
    : data;

  uploadExportData(exportData, user?.id, filename, "json");
  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(
  data: any[],
  filename: string,
  columnVisibility?: Record<string, boolean>
) {
  // Filter data by columns if columnVisibility is provided
  const exportData = columnVisibility
    ? data.map((item) => filterObjectByColumns(item, columnVisibility))
    : data;

  uploadExportData(exportData, user?.id, filename, "xlsx");
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, filename);
}

// Helper function to convert JSON to CSV
function convertToCSV(objArray: any[]) {
  if (objArray.length === 0) return "";

  const fields = Object.keys(objArray[0]);
  const header = fields.join(",");

  const rows = objArray.map((obj) => {
    return fields
      .map((field) => {
        const value = obj[field];
        // Handle strings with commas by wrapping in quotes
        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"') || value.includes("\n"))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value !== undefined && value !== null ? value : "";
      })
      .join(",");
  });

  return [header, ...rows].join("\n");
}

export async function uploadExportData<T>(
  data: any,
  userId: string | undefined,
  fileName: string,
  fileType: string
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data,
      user_id: userId,
      file_name: fileName,
      file_type: fileType,
    }),
  });

  if (!res.ok) throw new Error("Failed to POST");

  return res.json();
}
