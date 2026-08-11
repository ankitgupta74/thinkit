import { HomeIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  category: string;
  categoryLabel: string;
  productName: string;
};

const ProductBreadcrumbs = ({ category, categoryLabel, productName }: Props) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
      <Link href="/" className="hover:text-app-green transition-colors">
        <HomeIcon className="size-4" />
      </Link>
      <span>/</span>
      <Link href="/products" className="hover:text-app-green transition-colors">
        Products
      </Link>
      <span>/</span>
      <Link
        href={`/products?category=${category}`}
        className="hover:text-app-green transition-colors capitalize"
      >
        {categoryLabel}
      </Link>
      <span>/</span>
      <span className="text-app-green font-medium truncate max-w-50">
        {productName}
      </span>
    </nav>
  );
};

export default ProductBreadcrumbs;
