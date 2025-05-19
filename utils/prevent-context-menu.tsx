export function preventDefaultContextMenu() {
  // Add event listener to prevent default context menu on tables
  document.addEventListener("contextmenu", (e) => {
    // Only prevent context menu on table rows
    if ((e.target as HTMLElement).closest("tr")) {
      e.preventDefault();
    }
  });
}
