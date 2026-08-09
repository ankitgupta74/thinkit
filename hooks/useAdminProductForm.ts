import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export function useAdminProductForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  // Edit mode requires existing product data.
  useEffect(() => {
    // When editing, load existing product data into the form
    const fetchData = async () => {
      try {
        if (isEdit) {
          // Find the product that matches the id from the URL
          const data = await api<{
            success: boolean;
            product: {
              name: string;
              description: string;
              price: number;
              originalPrice: number;
              image: string;
              category: string;
              unit: string;
              stock: number;
              isOrganic: boolean;
            };
          }>(`/products/${id}`);

          if (data.success) {
            const product = data.product;

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
      } catch (error) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Failed to save product. Please try again.";

        toast.error(message);
      } finally {
        // Hide loader after product data is ready
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit]);

  // Upload image first and return final image URL.
  const uploadImage = async () => {
    if (!imageFile) return formData.image;

    // FormData is required for file uploads.
    const uploadData = new FormData();

    uploadData.append("image", imageFile);

    // Send image file to upload endpoint.
    const data = await api<{
      success: boolean;
      url: string;
    }>("/upload", {
      method: "POST",
      body: uploadData,
    });

    return data.url;
  };

  // Handles both create and edit product operations.
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Ensure image is uploaded before saving product.
      const imageUrl = await uploadImage();

      // Convert form strings into proper database types.
      const payload = {
        ...formData,
        image: imageUrl,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || 0,
        stock: Number(formData.stock),
      };

      // Reuse same form for both product creation and editing.
      await api(isEdit ? `/products/${id}` : "/products", {
        method: isEdit ? "PUT" : "POST",
        body: payload,
      });

      // Return to products page after successful save.
      window.location.href = "/admin/products";

      toast.success("Changes Saved");
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit products. Please try again.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return {
    isEdit,
    loading,
    saving,
    imageFile,
    setImageFile,
    formData,
    setFormData,
    handleSubmit,
  };
}
