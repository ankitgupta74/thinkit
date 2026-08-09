"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/types";
import { SavedItemCard } from "./SavedItemCard";
import type { SaveForLaterItem } from "@/types";

type SavedItem = SaveForLaterItem;

type Props = {
  saveForLater: SavedItem[];
  itemsLength: number; // for mt-auto vs mt-8
  processingId: string | null;
  setProcessingId: (id: string | null) => void;
  removeFromSaveForLater: (id: string) => Promise<void>;
  addToCart: (product: Product, qty: number) => void;
};

export function SavedForLaterSection({
  saveForLater,
  itemsLength,
  processingId,
  setProcessingId,
  removeFromSaveForLater,
  addToCart,
}: Props) {
  const [isSavedExpanded, setIsSavedExpanded] = useState(true);

  if (saveForLater.length === 0) return null;

  const handleMoveToCart = async (savedId: string, product: Product) => {
    if (processingId) return;
    setProcessingId(savedId);
    try {
      await removeFromSaveForLater(savedId);
      addToCart(product, 1);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (savedId: string) => {
    if (processingId) return;
    setProcessingId(savedId);
    try {
      await removeFromSaveForLater(savedId);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div
      className={`shrink-0 ${itemsLength === 0 ? "mt-auto" : "mt-8"} border-t border-app-border pt-6`}
    >
      <button
        onClick={() => setIsSavedExpanded(!isSavedExpanded)}
        className="flex items-center justify-between w-full text-left mb-2 group select-none"
      >
        <h3 className="text-sm font-semibold text-app-text transition-colors">
          Saved for later ({saveForLater.length} items)
        </h3>
        <motion.div
          animate={{ rotate: isSavedExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="p-1 rounded-full group-hover:bg-app-cream text-app-text-light transition-colors"
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
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-2">
              <AnimatePresence initial={false} mode="popLayout">
                {saveForLater.map((savedItem) => {
                  const product = savedItem.product as Product;
                  return (
                    <motion.div
                      key={savedItem._id}
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
                      <SavedItemCard
                        product={product}
                        savedId={savedItem._id}
                        isProcessing={processingId === savedItem._id}
                        onMoveToCart={handleMoveToCart}
                        onDelete={handleDelete}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
