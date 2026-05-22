"use client";

import {
  ReactNode,        // Allows children components.
  useState        // Stores state.
} from "react";
import { useCartStorage } from "./hooks/useCartStorage";
import CartContext from "./cartContext";
import { Product } from "@/types";
import {
  addItemToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  cartCount,
  cartTotal
}
from "./utils/cartHelpers";

export function CartProvider({ children }: { children: ReactNode }) {

  const [isCartOpen, setIsCartOpen] = useState(false);

  const {
    items,
    setItems
  } = useCartStorage();

  const addToCart=(
    product: Product,
    quantity=1
    )=>{

    setItems(prev=>
    addItemToCart(
    prev,
    product,
    quantity
    ))

    setIsCartOpen(true)

  }

  const removeItem=(productId:string)=>{
    setItems(prev => removeFromCart(prev, productId));
  }

  const updateItemQuantity=(
    productId:string,
    quantity:number
  )=>{
    setItems(prev => updateQuantity(prev, productId, quantity));
  }

  const clear=()=>{
    setItems(clearCart());
    setIsCartOpen(false);
  }

  const totalCount =
    cartCount(items);

  const totalPrice =
    cartTotal(items);
  
  // Provider makes cart data/functions available to every child component.
  return <CartContext.Provider value={{
    // Everything placed here becomes accessible via useCart().
    items,
    addToCart,
    removeFromCart:removeItem,
    updateQuantity:updateItemQuantity,
    clearCart:clear,
    cartCount:totalCount,
    cartTotal:totalPrice,
    isCartOpen,
    setIsCartOpen
  }}>
    {children}
  </CartContext.Provider>
}
