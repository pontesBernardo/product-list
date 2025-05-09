export function generateRandomID(existing: Set<string>) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id;
  do {
    id = Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } while (existing.has(id));
  existing.add(id);
  return id;
}