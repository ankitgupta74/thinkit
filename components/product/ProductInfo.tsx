import { Product } from '@/types';
import { CURRENCY } from '@/utils/config';
import { StarIcon } from 'lucide-react';

type Props = {
  product: Product;
  categoryLabel: string;
};

function ProductInfo({ product, categoryLabel }: Props) {
  return (
    <>
      <span className="text-xs font-medium text-app-text-light tracking-wider mb-2 capitalize">
        {categoryLabel}
      </span>
      <h1 className="text-2xl md:text-3xl font-semibold text-app-green mb-3">
        {product.name}
      </h1>
      {/* Rating */}
      {product.rating > 0 && (
        <div className="flex items-center gap-2 mb-5">
          <div className="flex items-center gap-0.5">
            {/* Create 5 stars and fill only required amount */}
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-4 h-4 ${star <= Math.round(product.rating) ? "text-app-warning fill-app-warning" : "text-app-border"}`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-app-text-light">
            ({product.reviewCount} reviews)
          </span>
        </div>
      )}
      {/* Price */}
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-3xl md:text-4xl font-semibold text-app-green">
          {CURRENCY} {product.price.toFixed(2)}
        </span>
        {product.originalPrice > product.price && (
          <span className="text-lg text-app-text-light line-through">
            {CURRENCY}
            {product.originalPrice.toFixed(2)}
          </span>
        )}
      </div>
      {/* Description */}
      <p className="text-sm text-app-text-light leading-relaxed mb-6">
        {product.description}
      </p>
      {/* Stock */}
      <div className="mb-6">
        {product.stock > 0 ? (
          <span className="text-sm text-app-success font-medium">
            ✓ In Stock ({product.stock} available)
          </span>
        ) : (
          <span className="text-sm text-app-error font-medium">
            Out of Stock
          </span>
        )}
      </div>
    </>
  );
}

export default ProductInfo;
