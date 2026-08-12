import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { Review } from "@/types/review";
import toast from "react-hot-toast";

export function useReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api<{
        success: boolean;
        reviews: Review[];
        canReview: boolean;
      }>(`/products/${productId}/reviews`);
      setReviews(data.reviews);
      setCanReview(data.canReview);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!productId) return;

    const loadReviews = async () => {
      await fetchReviews();
    };

    loadReviews();
  }, [productId, fetchReviews]);

  const addReview = async (rating: number, comment: string) => {
    try {
      const data = await api<{ success: boolean; review: Review }>(
        `/products/${productId}/reviews`,
        {
          method: "POST",
          body: JSON.stringify({ rating, comment }),
        },
      );
      setReviews((prev) => [data.review, ...prev]);
      toast.success("Review posted successfully!");
      return true;
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to post review.");
      return false;
    }
  };

  const updateReview = async (
    reviewId: string,
    rating: number,
    comment: string,
  ) => {
    try {
      const data = await api<{ success: boolean; review: Review }>(
        `/products/${productId}/reviews/${reviewId}`,
        {
          method: "PUT",
          body: JSON.stringify({ rating, comment }),
        },
      );
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...data.review, hasVoted: r.hasVoted }
            : r,
        ),
      );
      toast.success("Review updated!");
      return true;
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to update review.");
      return false;
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await api(`/products/${productId}/reviews/${reviewId}`, {
        method: "DELETE",
      });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.success("Review deleted.");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to delete review.");
    }
  };

  const toggleHelpful = async (reviewId: string) => {
    try {
      const data = await api<{ success: boolean; voted: boolean }>(
        `/products/${productId}/reviews/${reviewId}/helpful`,
        {
          method: "POST",
        },
      );
      setReviews((prev) =>
        prev.map((r) => {
          if (r._id === reviewId) {
            return {
              ...r,
              hasVoted: data.voted,
              helpfulCount: r.helpfulCount + (data.voted ? 1 : -1),
            };
          }
          return r;
        }),
      );
    } catch (error: unknown) {
      toast.error((error as Error).message || "Log in to vote.");
    }
  };

  return {
    reviews,
    loading,
    canReview,
    addReview,
    updateReview,
    deleteReview,
    toggleHelpful,
  };
}
