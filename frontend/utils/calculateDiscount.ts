// Calculates the percentage reduction between original and selling price.
// Keep discount calculation in one reusable place.
//
// Product APIs can calculate the latest discount from price values instead of saving a separate discount field in the database.
export function calculateDiscount(
  price: number,
  originalPrice: number,
): number {
  // No discount exists when original price is missing, invalid, or not higher than the selling price.
  if (
    !Number.isFinite(price) ||
    !Number.isFinite(originalPrice) ||
    originalPrice <= 0 ||
    price >= originalPrice
  ) {
    return 0;
  }

  // Round the result so the UI can show a clean whole-number percentage.
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
