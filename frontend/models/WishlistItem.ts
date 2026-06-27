import mongoose, {
  model,
  models,
  Schema
} from "mongoose";

// A user can have multiple unique wishlist items.
const wishlistItemSchema = new Schema(
  {
    // Connects this wishlist item to its owner (User collection).
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // IXSCAN
    },
    // Connects this wishlist to its source (Product collection).
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    // Automatically creates createdAt and updatedAt fields.
    timestamps: true,
  },
);

// A user cannot wishlist the same product more than once.
wishlistItemSchema.index(
  {
    user: 1,
    product: 1,
  },
  {
    unique: true,
  },
);

// Prevents model overwrite error during Next.js hot reload.
const WishlistItem = models.WishlistItem || model("WishlistItem", wishlistItemSchema);

export default WishlistItem;