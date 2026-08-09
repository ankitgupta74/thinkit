// Snapshot of products at the time of purchase.
import mongoose, { Schema } from "mongoose";

// We store product details here so old orders remain accurate even if product information changes later.
export const orderItemSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      required: true,
    },
  },
  {
    _id: true,
  },
);
