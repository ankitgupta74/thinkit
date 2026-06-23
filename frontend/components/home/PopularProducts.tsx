// Flow: Load Products → Store In State → Display Product Cards → Link Customer To Full Catalog

"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/ui/Loader";
import { Product } from "@/types";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import ProductCard from "../product/ProductCard";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

function PopularProducts() {
  // Stores products displayed in the section.
  const [products, setProducts] = useState<Product[]>([]);

  // Controls loader visibility while products are being fetched.
  const [loading, setLoading] = useState(true);

  // Load products when the component appears on the page.
  useEffect(() => {
    async function loadProducts() {
      try {
        // Get product data through the shared API helper.
        const data = await api<{
          success: boolean;
          products: Product[];
        }>("/products");

        // Only show a limited number of products on the homepage.
        setProducts(data.products.slice(0, 10));
      } catch (error: unknown) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load popular products. Please try again.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Show a loading state until products are ready.
  if (loading) {
    return <Loader />;
  }
  return (
    <section className="pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="">
            <h2 className="text-2xl font-semibold">Popular Products</h2>
            <p className="text-sm text-app-text-light mt-1">
              Top-rated products this season
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-app-orange hover:text-app-orange-dark flex items-center gap-1 transition-colors"
          >
            View All <ArrowRightIcon className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-8">
          {/* Render one card for each selected product */}
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularProducts;
