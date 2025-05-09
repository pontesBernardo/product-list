export function generateUniquePrices(count: number) {
  const prices = new Set<number>();
  while (prices.size < count) {
    const price = parseFloat((Math.random() * (300 - 50) + 50).toFixed(2));
    prices.add(price);
  }
  return Array.from(prices);
}