"use client";

import {
  useState,
  useEffect
} from "react";
import { ArrowLeftIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  categoriesData,
  dummyProducts
} from "@/public/assets";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { CURRENCY } from "@/utils/config";
import Image from "next/image";

export default function AdminProductForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // If an id exists, we are editing an existing product.
  // Otherwise we are creating a new one.
  const isEdit = Boolean(id);

  // Show loader while existing product data is loading
  const [loading, setLoading] = useState(isEdit);

  // Prevent multiple save requests
  const [saving, setSaving] = useState(false);

  // Stores the newly selected image file
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Stores all product form values in one place
  // This makes the form easier to manage and submit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    image: "",
    category: "",
    unit: "",
    stock: "",
    isOrganic: false,
  });

  useEffect(() => {
    // When editing, load existing product data into the form
    const fetchData = async () => {
      if (isEdit) {
        // Find the product that matches the id from the URL
        const product = dummyProducts.find((p) => p._id === id);

        if (product) {
          // Fill form fields with existing product data
          setFormData({
            name: product.name,
            description: product.description,
            price: String(product.price),
            originalPrice: String(product.originalPrice),
            image: product.image,
            category: product.category,
            unit: product.unit,
            stock: String(product.stock),
            isOrganic: product.isOrganic,
          });
        }
      }
      // Hide loader after product data is ready
      setLoading(false);
    };
    fetchData();
  }, [id, isEdit]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    // Prevent page refresh when submitting the form
    e.preventDefault();
  };

  return (
    <>
      {/* Product creation/editing section */}
      <div className="bg-white rounded-2xl shadow-sm border border-app-border overflow-hidden">
        <div className="px-6 py-5 border-b border-app-border flex items-center gap-4">
          <Link
            // Return to products list page
            href="/admin/products"
            className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="size-5" />
          </Link>
          {/* Reuse the same form for both create and edit actions */}
          <h2 className="text-xl font-semibold text-zinc-900">
            {isEdit ? "Edit Product" : "New Product"}
          </h2>
        </div>
        {/* Show loader while edit data is being prepared */}
        {loading ? (
          <Loader />
        ) : (
          // Main product form
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  required
                  type="text"
                  value={formData.name}
                  // Copy existing form values and update only the changed field
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-app-green focus:ring-1 focus:ring-app-green outline-none transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Category
                </label>
                {/* Select product category from available options */}
                <select
                  id="category"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-app-green focus:ring-1 focus:ring-app-green outline-none transition-all bg-white"
                >
                  <option value="">Select a category</option>
                  {/* Generate category options from data source */}
                  {categoriesData.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {/* Currency comes from a central configuration value */}
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Price ({CURRENCY})
                </label>
                <input
                  id="price"
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-app-green focus:ring-1 focus:ring-app-green outline-none transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="originalPrice"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Original Price ({CURRENCY}) - Optional
                </label>
                <input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, originalPrice: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-app-green focus:ring-1 focus:ring-app-green outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Unit
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g., kg, piece, liter"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-app-green focus:ring-1 focus:ring-app-green outline-none transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Stock
                </label>
                <input
                  id="stock"
                  required
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-app-green focus:ring-1 focus:ring-app-green outline-none transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  {/* Currency comes from a central configuration value */}
                  {(imageFile || formData.image) && (
                    <div className="size-16 rounded-lg border border-zinc-200 overflow-hidden shrink-0 bg-app-cream">
                      <Image
                        // Prefer newly selected image.
                        // Otherwise show the saved product image.
                        src={
                          imageFile
                            ? URL.createObjectURL(imageFile)
                            : formData.image
                        }
                        alt="Preview"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {/* Allow admin to upload a product image */}
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-app-green outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-app-orange file:text-white hover:file:bg-orange-600 cursor-pointer"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Description
                </label>
                {/* Longer text area for detailed product information */}
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-app-green focus:ring-1 focus:ring-app-green outline-none transition-all resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="isOrganic"
                  className="text-sm font-medium text-zinc-700 cursor-pointer"
                >
                  Organic
                </label>
                {/* Simple true/false field for organic products */}
                <input
                  type="checkbox"
                  id="isOrganic"
                  checked={formData.isOrganic}
                  onChange={(e) =>
                    setFormData({ ...formData, isOrganic: e.target.checked })
                  }
                  className="size-5 text-app-green rounded border-zinc-300 focus:ring-app-green cursor-pointer"
                />
              </div>
            </div>

            {/* Form actions area */}
            <div className="pt-6 border-t border-app-border flex justify-end">
              <button
                // Prevent multiple save attempts while request is running
                disabled={saving}
                type="submit"
                className="px-6 py-2.5 bg-app-orange text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {/* Prevent multiple save attempts while request is running */}
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
