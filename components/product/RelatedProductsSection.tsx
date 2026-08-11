import { Product } from "@/types";
import { ArrowRightIcon } from "lucide-react";
import ProductCard from "./ProductCard";
import Link from "next/link";

type Props = {
  products: Product[];
  category: string;
  categoryLabel: string;
};

function RelatedProductsSection({ products, category, categoryLabel }: Props) {
  return (
    <div>
      {products.length > 0 && (
        <section className="my-12 ">
          <div className="flex items-center justify-between mb-6">
            <div className="">
              <h2 className="text-2xl font-semibold text-app-green">
                Related Products
              </h2>
              <p className="text-sm text-app-text-light mt-1">
                More from {categoryLabel}
              </p>
            </div>
            <Link
              href={`/products?category=${category}`}
              className="text-sm font-semibold text-app-orange hover:text-app-orange-dark flex items-center gap-1 transition-colors"
            >
              View All <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-8">
            {products.slice(0, 5).map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default RelatedProductsSection;
