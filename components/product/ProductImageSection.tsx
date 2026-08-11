"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LeafIcon } from "lucide-react";

type Props = {
  image: string;
  name: string;
  isOrganic: boolean;
  discount: number;
};

const ProductImageSection = ({ image, name, isOrganic, discount }: Props) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex-center p-8 md:p-12 min-h-80 md:min-h-120"
    >
      <Image
        src={image}
        alt={name}
        width={400}
        height={400}
        loading="eager"
        className="max-h-90 w-auto object-contain"
      />
      {/* Badge */}
      <div className="absolute top-5 left-5 flex flex-wrap gap-1.5">
        {isOrganic && (
          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-app-green text-white rounded-full">
            <LeafIcon className="w-3 h-3" /> Organic
          </span>
        )}
        {discount > 0 && (
          <span className="px-2.5 py-1 text-xs font-semibold bg-app-orange text-white rounded-full">
            {discount}% OFF
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ProductImageSection;
