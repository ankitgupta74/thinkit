import { CartItem } from "@/types";

// Reads the saved guest cart safely from browser storage.
export function getStoredCart(cartStorageKey: string): CartItem[] {
  // localStorage is available only in the browser.
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedCart = window.localStorage.getItem(cartStorageKey);

    // No saved cart means customer starts with an empty cart.
    if (!savedCart) {
      return [];
    }

    const parsedCart: unknown = JSON.parse(savedCart);

    // Only accept array-shaped saved data.
    return Array.isArray(parsedCart) ? (parsedCart as CartItem[]) : [];
  } catch {
    // Broken or outdated storage should not crash the application.
    window.localStorage.removeItem(cartStorageKey);

    return [];
  }
}
