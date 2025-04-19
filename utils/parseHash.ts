// utils/parseHash.ts
export function parseHashParams(hash: string) {
  const params = new URLSearchParams(
    hash.startsWith("#") ? hash.slice(1) : hash
  );
  return Object.fromEntries(params.entries());
}
