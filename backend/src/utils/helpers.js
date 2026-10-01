export const sortBy = (items, key, ascending = true) => {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const valA = a[key] ?? 0;
    const valB = b[key] ?? 0;
    if (valA === valB) return 0;
    return ascending ? (valA > valB ? 1 : -1) : (valA > valB ? -1 : 1);
  });
};
