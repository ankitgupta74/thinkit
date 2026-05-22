import { useContext } from "react"; // Reads from shared storage.
import CartContext from "./cartContext";

export function useCart() {
  // Read cart data from nearest CartProvider above in component tree.
  const context = useContext(CartContext);

  // Guard pattern: fail early if hook is used outside provider.
  if (!context) throw new Error("useCart must be used within CartProvider");

  return context;
}
