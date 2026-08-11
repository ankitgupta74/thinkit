"use client";

import { motion } from "framer-motion";
import { CartTooltip } from "../cart/CartTooltip";
import { MinusIcon, PlusIcon } from "lucide-react";

type Props = {
  displayQuantity: number;
  isMinusDisabled: boolean;
  isPlusDisabled: boolean;
  inCart: boolean;
  cartQuantity?: number;
  stock: number;
  onMinus: () => void;
  onPlus: () => void;
};

function ProductQuantityControl({
  displayQuantity,
  isMinusDisabled,
  isPlusDisabled,
  inCart,
  cartQuantity,
  stock,
  onMinus,
  onPlus,
}: Props) {
  return (
    <div className="flex items-center border border-app-border rounded-xl overflow-hidden bg-white">
      {/* Minus Button */}
      <CartTooltip text={inCart && cartQuantity === 1 ? "Remove" : "Decrease"}>
        <motion.button
          type="button"
          aria-label="Decrease Product Quantity"
          disabled={isMinusDisabled}
          onClick={onMinus}
          whileHover={!isMinusDisabled ? { scale: 1.05 } : {}}
          whileTap={!isMinusDisabled ? { scale: 0.92 } : {}}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          className={`p-3 transition-colors ${
            isMinusDisabled
              ? "opacity-40 cursor-not-allowed text-app-text-light/50"
              : "text-app-text-light hover:text-app-green hover:bg-gray-50 active:bg-gray-100"
          }`}
        >
          <MinusIcon className="w-4 h-4" />
        </motion.button>
      </CartTooltip>

      <span className="px-5 text-sm font-semibold min-w-10 text-center select-none">
        {displayQuantity}
      </span>

      {/* Plus Button - THIS WAS MISSING TOOLTIP */}
      <CartTooltip
        text={isPlusDisabled ? `Only ${stock} in stock` : "Increase"}
      >
        <motion.button
          type="button"
          aria-label="Increase Product Quantity"
          disabled={isPlusDisabled}
          onClick={onPlus}
          whileHover={!isPlusDisabled ? { scale: 1.05 } : {}}
          whileTap={!isPlusDisabled ? { scale: 0.92 } : {}}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          className={`p-3 transition-colors ${
            isPlusDisabled
              ? "opacity-40 cursor-not-allowed text-app-text-light/50"
              : "text-app-text-light hover:text-app-green hover:bg-gray-50 active:bg-gray-100"
          }`}
        >
          <PlusIcon className="w-4 h-4" />
        </motion.button>
      </CartTooltip>
    </div>
  );
}

export default ProductQuantityControl;
