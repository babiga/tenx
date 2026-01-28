/**
 * Amount utility functions for MNT (Mongolian Tögrög)
 * MNT has no subdivisions (no cents), so all amounts must be whole numbers
 */

/**
 * Round amount to nearest whole number (tögrög)
 * @param amount - The amount to round
 * @returns Whole number amount
 */
export function roundToWholeAmount(amount: number): number {
  return Math.round(amount);
}

/**
 * Calculate discounted amount with proper rounding
 * @param subtotal - Subtotal before discount
 * @param discountRate - Discount rate (0.1 for 10%)
 * @returns Object with rounded discountAmount and totalAmount
 */
export function calculateDiscountedAmount(
  subtotal: number,
  discountRate: number
): { discountAmount: number; totalAmount: number } {
  const discountAmount = roundToWholeAmount(subtotal * discountRate);
  const totalAmount = roundToWholeAmount(subtotal - discountAmount);

  return { discountAmount, totalAmount };
}

/**
 * Validate that amount is a whole number
 * @param amount - The amount to validate
 * @param fieldName - Name of the field for error message
 * @throws Error if amount is not a whole number
 */
export function assertWholeAmount(amount: number, fieldName: string = 'Amount'): void {
  if (!Number.isInteger(amount)) {
    throw new Error(`${fieldName} must be a whole number, got: ${amount}`);
  }
}
