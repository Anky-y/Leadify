import * as XLSX from "xlsx";

// Helper function to filter object properties based on column visibility
export function filterObjectByColumns(
  obj: any,
  columnVisibility: Record<string, boolean>
): any {
  // Define mapping between column visibility keys and actual data properties
  const columnToPropertyMap: Record<string, string> = {
    username: "username",
    followers: "followers",
    viewers: "viewer_count",
    language: "language",
    category: "game_name",
    social: "social", // This will be handled specially
    email: "gmail",
    folder: "folder_id",
    date: "savedAt",
    favorite: "is_favourite",
  };

  // Create a new object with only the visible columns
  const filteredObj: any = {};

  // Always include id for reference
  if (obj.id) filteredObj.id = obj.id;

  // Add visible columns
  Object.entries(columnVisibility).forEach(([column, isVisible]) => {
    if (isVisible && columnToPropertyMap[column]) {
      const property = columnToPropertyMap[column];

      // Special handling for social media
      if (column === "social") {
        if (obj.discord) filteredObj.discord = obj.discord;
        if (obj.youtube) filteredObj.youtube = obj.youtube;
        if (obj.twitter) filteredObj.twitter = obj.twitter;
        if (obj.facebook) filteredObj.facebook = obj.facebook;
        if (obj.instagram) filteredObj.instagram = obj.instagram;
      } else {
        // Regular property
        if (obj[property] !== undefined) {
          filteredObj[property] = obj[property];
        }
      }
    }
  });

  // Always include channel URL if available
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
