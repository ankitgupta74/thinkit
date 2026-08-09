"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart/useCart";
import { useSaveForLater } from "@/hooks/useSaveForLater";
import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import { CartHeader } from "./CartHeader";
import { CartEmptyState } from "./CartEmptyState";
import { CartItemCard } from "./CartItemCard";
import { SavedForLaterSection } from "./SavedForLaterSection";
import { CartFooter } from "./CartFooter";
import type { Product } from "@/types";


function CartSidebar() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeFromCart,
    addToCart,
    isCartOpen,
    setIsCartOpen,
    cartTotal,
  } = useCart();
  const { saveForLater, addToSaveForLater, removeFromSaveForLater } =
    useSaveForLater();
  const [processingId, setProcessingId] = useState<string | null>(null);

  useBodyScrollLock(isCartOpen);

  const deliveryFee = cartTotal > 149 ? 0 : 49;
  const grandTotal = cartTotal + deliveryFee;

  const handleSaveForLater = async (productId: string) => {
    if (processingId) return;
    setProcessingId(productId);
    try {
      await addToSaveForLater(productId);
      removeFromCart(productId);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 200,
            }}
            className="fixed right-0 top-0 h-[100dvh] w-full sm:max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <CartHeader
              count={items.length}
              onClose={() => setIsCartOpen(false)}
            />

            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-5 space-y-4 flex flex-col">
              {items.length === 0 ? (
                <CartEmptyState />
              ) : (
                <AnimatePresence initial={false} mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.product._id}
                      layout
                      initial={{
                        opacity: 0,
                        scale: 0.95,
                        height: 0,
                        marginBottom: 0,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        height: "auto",
                        marginBottom: 16,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        height: 0,
                        marginBottom: 0,
                      }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <CartItemCard
                        product={item.product as Product}
                        quantity={item.quantity}
                        isProcessing={processingId === item.product._id}
                        onUpdate={updateQuantity}
                        onRemove={removeFromCart}
                        onSave={handleSaveForLater}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              <SavedForLaterSection
                saveForLater={saveForLater}
                itemsLength={items.length}
                processingId={processingId}
                setProcessingId={setProcessingId}
                removeFromSaveForLater={removeFromSaveForLater}
                addToCart={addToCart}
              />
            </div>

            {items.length > 0 && (
              <CartFooter
                cartTotal={cartTotal}
                deliveryFee={deliveryFee}
                grandTotal={grandTotal}
                onCheckout={() => {
                  setIsCartOpen(false);
                  router.push("/checkout");
                  window.scrollTo(0, 0);
                }}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartSidebar;
