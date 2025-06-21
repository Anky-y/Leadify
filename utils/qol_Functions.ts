export function getPlanName(fullPlan: string): string {
  const match = fullPlan.match(/^([^\(]+)/);
  return match ? match[1].trim() : fullPlan;
}
