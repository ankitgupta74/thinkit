import {
  Schema,
  models,
  model
} from "mongoose";

// Main catalog of products shown to customers.
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    // Used for showing discounts such as "₹100 → ₹80".
    originalPrice: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    // Defines how product quantity is measured (kg, litre, piece, etc.).
    unit: {
      type: String,
      default: "piece",
    },

    // Available inventory quantity.
    stock: {
      type: Number,
      default: 0,
    },

    // Useful for filtering and displaying organic products separately.
    isOrganic: {
      type: Boolean,
      default: false,
    },

    // Cached values for faster product listing display.
    rating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },
  },
  {
    // Automatically creates createdAt and updatedAt fields.
    timestamps: true,
  },
);

// Avoids model recreation during Next.js hot reload.
const Product = models.Product || model("Product", productSchema);

export default Product;
