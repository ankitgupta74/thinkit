"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  Trash2Icon,
  XIcon,
  Bookmark,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import { useSaveForLater } from "@/hooks/useSaveForLater";
import type { Product } from "@/types";
import { useCart } from "@/context/cart/useCart";
import { CURRENCY } from "@/utils/config";

function ActionTooltip({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 8,
      left: rect.right,
    });

    setShow(true);
  };

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed z-[9999] -translate-x-full px-2.5 py-1.5 bg-app-green text-white text-[10px] font-medium rounded-lg shadow-md whitespace-nowrap pointer-events-none"
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {text}

            <div className="absolute -top-1 right-2 border-x-[4px] border-x-transparent border-b-[4px] border-b-app-green border-t-0" />
          </div>,
          document.body,
        )}
    </div>
  );
}

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
  const [isSavedExpanded, setIsSavedExpanded] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Prevent background scrolling when sidebar is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const deliveryFee = cartTotal > 149 ? 0 : 49;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay - Soft Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Sidebar - Buttery Spring Slide */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 200 }}
            className="fixed right-0 top-0 h-[100dvh] w-full sm:max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-4 sm:px-5 py-5 border-b border-app-border">
              <div className="flex items-center gap-2">
                <ShoppingBagIcon className="size-5" />
                <h2 className="text-lg font-medium">Your Cart</h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-app-cream rounded-full">
                  {items.length} items
                </span>
              </div>
              <ActionTooltip text="Close cart">
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl hover:bg-app-cream transition-colors"
                >
                  <XIcon className="size-5" />
                </button>
              </ActionTooltip>
            </div>
            {/* Items */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-5 space-y-4 flex flex-col">
              {items.length === 0 ? (
                <div className="flex flex-1 min-h-60 flex-col items-center justify-center py-12 text-center">
                  <ShoppingBagIcon className="size-16 text-app-border mb-4" />
                  <h3 className="text-lg font-medium mb-1">
                    Your cart is empty
                  </h3>
                </div>
              ) : (
                <AnimatePresence initial={false} mode="popLayout">
                  {items.map((item) => {
                    const isProcessing = processingId === item.product._id;

                    return (
                      <motion.div
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
                        transition={{
                          duration: 0.4,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                        className="flex gap-3 bg-app-cream/60 rounded-xl p-3 overflow-hidden"
                        key={item.product._id}
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="size-16 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="text-sm font-semibold truncate text-app-text transition-colors">
                                {item.product.name}
                              </h4>
                              <p className="text-xs text-app-text-light mt-0.5">
                                {CURRENCY}
                                {item.product.price.toFixed(2)} /{" "}
                                {item.product.unit}
                              </p>
                            </div>
                            <span className="text-sm font-semibold whitespace-nowrap text-app-text">
                              {CURRENCY}
                              {(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Smooth Quantity Controls */}
                            <div
                              className={`flex items-center gap-1 bg-white rounded-lg border border-app-border/60 p-0.5 shadow-sm transition-opacity ${isProcessing ? "opacity-50" : "opacity-100"}`}
                            >
                              <ActionTooltip text="Decrease">
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() =>
                                    updateQuantity(
                                      item.product._id,
                                      item.quantity - 1,
                                    )
                                  }
                                  className="size-6 rounded-md hover:bg-app-cream flex-center transition-colors active:scale-90 text-app-text disabled:cursor-not-allowed"
                                >
                                  <MinusIcon className="size-3" />
                                </button>
                              </ActionTooltip>
                              <span className="text-xs font-semibold w-6 text-center select-none">
                                {item.quantity}
                              </span>
                              <ActionTooltip text="Increase">
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() =>
                                    updateQuantity(
                                      item.product._id,
                                      item.quantity + 1,
                                    )
                                  }
                                  className="size-6 rounded-md hover:bg-app-cream flex-center transition-colors active:scale-90 text-app-text disabled:cursor-not-allowed"
                                >
                                  <PlusIcon className="size-3" />
                                </button>
                              </ActionTooltip>
                            </div>

                            <div className="flex items-center gap-1">
                              <ActionTooltip text="Save for later">
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={async () => {
                                    if (isProcessing) return;
                                    setProcessingId(item.product._id);
                                    try {
                                      await addToSaveForLater(item.product._id);
                                      removeFromCart(item.product._id);
                                    } finally {
                                      setProcessingId(null);
                                    }
                                  }}
                                  className="p-1.5 text-app-text-light hover:text-app-orange hover:bg-orange-50 rounded-lg transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Bookmark className="size-4" />
                                </button>
                              </ActionTooltip>
                              <ActionTooltip text="Remove item">
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() =>
                                    removeFromCart(item.product._id)
                                  }
                                  className="p-1.5 text-app-text-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Trash2Icon className="size-4" />
                                </button>
                              </ActionTooltip>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              {/* Saved for Later Section */}
              {saveForLater.length > 0 && (
                <div
                  className={`${items.length === 0 ? "mt-auto" : "mt-8"} border-t border-app-border pt-6`}
                >
                  <button
                    onClick={() => setIsSavedExpanded(!isSavedExpanded)}
                    className="flex items-center justify-between w-full text-left mb-2 group select-none"
                  >
                    <h3 className="text-sm font-semibold text-app-text group-hover:text-app-orange transition-colors duration-300">
                      Saved for later ({saveForLater.length} items)
                    </h3>
                    <motion.div
                      animate={{ rotate: isSavedExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="p-1 rounded-full group-hover:bg-app-cream text-app-text-light group-hover:text-app-orange transition-colors"
                    >
                      <ChevronDown className="size-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isSavedExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 pt-2">
                          <AnimatePresence initial={false} mode="popLayout">
                            {saveForLater.map((savedItem) => {
                              const product = savedItem.product as Product;
                              const isProcessing =
                                processingId === savedItem._id;

                              return (
                                <motion.div
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
                                  transition={{
                                    duration: 0.4,
                                    ease: [0.25, 0.1, 0.25, 1],
                                  }}
                                  className="flex gap-3 bg-white border border-app-border/40 rounded-xl p-3 overflow-hidden transition-all duration-300"
                                  key={savedItem._id}
                                >
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={64}
                                    height={64}
                                    className={`size-16 rounded-lg object-cover shrink-0 transition-all duration-500 ${isProcessing ? "grayscale" : "grayscale-[0.3] hover:grayscale-0"}`}
                                  />
                                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div className="flex justify-between items-start gap-2">
                                      <div>
                                        <h4 className="text-sm font-medium truncate text-app-text-light">
                                          {product.name}
                                        </h4>
                                        <p className="text-[11px] text-app-text-light mt-0.5">
                                          /{product.unit}
                                        </p>
                                      </div>
                                      <span className="text-sm font-medium text-app-text-light whitespace-nowrap">
                                        {CURRENCY}
                                        {product.price.toFixed(2)}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-end mt-2 gap-1">
                                      <ActionTooltip text="Move to cart">
                                        <button
                                          type="button"
                                          disabled={isProcessing}
                                          onClick={async () => {
                                            if (isProcessing) return;
                                            setProcessingId(savedItem._id);
                                            try {
                                              await removeFromSaveForLater(
                                                savedItem._id,
                                              );
                                              addToCart(product, 1);
                                            } finally {
                                              setProcessingId(null);
                                            }
                                          }}
                                          className="p-1.5 text-app-text-light hover:text-app-success hover:bg-green-50 rounded-lg transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          <ShoppingCart className="size-4" />
                                        </button>
                                      </ActionTooltip>
                                      <ActionTooltip text="Delete saved">
                                        <button
                                          type="button"
                                          disabled={isProcessing}
                                          onClick={async () => {
                                            if (isProcessing) return;
                                            setProcessingId(savedItem._id);
                                            try {
                                              await removeFromSaveForLater(
                                                savedItem._id,
                                              );
                                            } finally {
                                              setProcessingId(null);
                                            }
                                          }}
                                          className="p-1.5 text-app-text-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          <Trash2Icon className="size-4" />
                                        </button>
                                      </ActionTooltip>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            {/* Footer */}
            {items.length > 0 && (
              <div className="shrink-0 px-4 sm:px-5 py-5 border-t border-app-border space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-app-text-light">Subtotal</span>
                  <span className="font-medium">
                    {CURRENCY}
                    {cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-app-text-light">Delivery Charges</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-app-success">Free</span>
                    ) : (
                      `${CURRENCY}${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-app-text-light text-center">
                    Free delivery on orders over {CURRENCY}149!
                  </p>
                )}
                <div className="flex justify-between text-base font-semibold border-t border-app-border pt-3">
                  <span>Total</span>
                  <span>
                    {CURRENCY}
                    {grandTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push("/checkout");
                    window.scrollTo(0, 0);
                  }}
                  className="w-full py-3 bg-app-orange text-white font-semibold rounded-xl hover:bg-app-orange-dark transition-colors flex-center gap-2 active:scale-[0.98]"
                >
                  Proceed to checkout <ArrowRightIcon className="size-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartSidebar;
