import mongoose, { Schema, models, model } from "mongoose";

const reviewSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    isEdited: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  },
);
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, rating: -1 });

const helpfulVoteSchema = new Schema(
  {
    review: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true },
);
helpfulVoteSchema.index({ review: 1, user: 1 }, { unique: true }); 

export const HelpfulVote =
  models.HelpfulVote || model("HelpfulVote", helpfulVoteSchema);
const Review = models.Review || model("Review", reviewSchema);

export default Review;
