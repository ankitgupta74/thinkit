"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  StarIcon,
  ThumbsUpIcon,
  Edit2Icon,
  Trash2Icon,
  MessageSquareIcon,
} from "lucide-react";
import type { Product } from "@/types";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/context/auth/useAuth";
import Loader from "@/components/ui/Loader";

export default function ReviewsSection({ product }: { product: Product }) {
  const { user } = useAuth();
  const {
    reviews,
    loading,
    canReview,
    addReview,
    updateReview,
    deleteReview,
    toggleHelpful,
  } = useReviews(product._id);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const breakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => counts[r.rating - 1]++);
    return counts.reverse(); // 5 to 1
  }, [reviews]);
  const maxCount = Math.max(...breakdown, 1);

  const userReview = reviews.find((r) => r.user._id === user?._id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;

    setIsSubmitting(true);
    let success;
    if (editingId) {
      success = await updateReview(editingId, rating, comment);
    } else {
      success = await addReview(rating, comment);
    }
    setIsSubmitting(false);

    if (success) {
      setIsFormOpen(false);
      setEditingId(null);
      setComment("");
      setRating(5);
    }
  };

  const handleEditInit = () => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment);
      setEditingId(userReview._id);
      setIsFormOpen(true);
    }
  };

  if (loading)
    return (
      <div className="py-12 flex-center">
        <Loader />
      </div>
    );

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-app-green">
          Customer Reviews
        </h2>
        {canReview && !isFormOpen && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              userReview ? handleEditInit() : setIsFormOpen(true)
            }
            className="px-4 py-2 bg-app-orange text-white text-sm font-semibold rounded-xl flex items-center gap-2"
          >
            {userReview ? (
              <>
                <Edit2Icon className="size-4" /> Edit Review
              </>
            ) : (
              <>
                <MessageSquareIcon className="size-4" /> Write a Review
              </>
            )}
          </motion.button>
        )}
      </div>

      <div className="bg-white/50 rounded-2xl p-6 md:p-8">
        {/* Write/Edit Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mb-8 p-5 bg-white border border-app-border rounded-xl shadow-sm overflow-hidden"
            >
              <h3 className="font-semibold text-app-green mb-3">
                {editingId ? "Edit your review" : "Write a review"}
              </h3>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon
                    key={s}
                    onClick={() => setRating(s)}
                    className={`size-6 cursor-pointer transition-colors ${s <= rating ? "text-app-warning fill-app-warning" : "text-app-border"}`}
                  />
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike?"
                className="w-full p-3 border border-app-border rounded-lg text-sm mb-3 focus:outline-none focus:border-app-green resize-none h-24"
                required
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm text-app-text-light hover:bg-app-cream rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm text-white bg-app-green rounded-lg hover:bg-app-green-light transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Summary Row */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-app-border">
          <div className="flex-center flex-col md:min-w-40 lg:w-1/3">
            <span className="text-5xl font-semibold text-app-green">
              {product.rating.toFixed(1)}
            </span>
            <div className="flex items-center gap-0.5 mt-2 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon
                  key={s}
                  className={`size-4 ${s <= Math.round(product.rating) ? "text-app-warning fill-app-warning" : "text-app-border"}`}
                />
              ))}
            </div>
            <span className="text-sm text-zinc-600">
              {reviews.length} reviews
            </span>
          </div>

          <div className="flex-1 space-y-2">
            {breakdown.map((count, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-zinc-600 w-8 text-right">
                  {5 - i} ★
                </span>
                <div className="flex-1 h-2.5 bg-app-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxCount) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-app-warning rounded-full"
                  />
                </div>
                <span className="text-xs text-zinc-600 w-6">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200"
            >
              <MessageSquareIcon className="size-8 text-gray-300 mb-3" />
              <h4 className="text-sm font-semibold text-app-text mb-1">
                No reviews yet
              </h4>
              <p className="text-sm text-app-text-light max-w-sm">
                {canReview
                  ? "You know this product best! Share your honest experience and help others decide."
                  : "Be the first to try this out! Order today and let the community know what you think."}
              </p>
            </motion.div>
          ) : ( 
            reviews.map((review) => (
              <div key={review._id} className="flex gap-4">
                <div className="size-10 rounded-full bg-app-green/10 text-app-green flex-center shrink-0 text-sm font-semibold uppercase">
                  {review.user.name.substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-app-text">
                        {review.user.name}
                      </span>
                      {review.isVerifiedPurchase && (
                        <span className="text-[10px] bg-app-green/10 text-app-green px-1.5 py-0.5 rounded-full font-medium">
                          Verified Purchase
                        </span>
                      )}
                      <span className="text-xs text-zinc-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </span>
                      {review.isEdited && (
                        <span className="text-xs text-zinc-400 italic">
                          (Edited)
                        </span>
                      )}
                    </div>
                    {user?._id === review.user._id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleEditInit}
                          className="text-zinc-400 hover:text-app-green transition-colors p-1"
                        >
                          <Edit2Icon className="size-3.5" />
                        </button>
                        <button
                          onClick={() => deleteReview(review._id)}
                          className="text-zinc-400 hover:text-app-error transition-colors p-1"
                        >
                          <Trash2Icon className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon
                        key={s}
                        className={`size-3.5 ${s <= review.rating ? "text-app-warning fill-app-warning" : "text-app-border"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-2">
                    {review.comment}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={() => toggleHelpful(review._id)}
                    className={`relative overflow-hidden flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                      review.hasVoted
                        ? "text-yellow-600 bg-yellow-50/80 border-yellow-300 shadow-sm"
                        : "text-zinc-500 hover:text-app-green bg-white border-app-border hover:border-app-green hover:shadow-sm"
                    }`}
                  >
                    {/* Gentle expanding ripple effect on vote */}
                    <AnimatePresence>
                      {review.hasVoted && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0.5 }}
                          animate={{ scale: 2.5, opacity: 0 }}
                          exit={{ opacity: 0, transition: { duration: 0 } }}
                          transition={{
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="absolute inset-0 bg-yellow-300 rounded-full pointer-events-none origin-center"
                        />
                      )}
                    </AnimatePresence>

                    <ThumbsUpIcon
                      className={`size-3.5 transition-all duration-500 ${
                        review.hasVoted ? "fill-yellow-500 text-yellow-500" : ""
                      }`}
                    />
                    <span className="relative z-10 font-medium">
                      Helpful ({review.helpfulCount})
                    </span>
                  </motion.button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
