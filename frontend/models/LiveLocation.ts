import { Schema } from "mongoose";

// Real-time delivery partner location used during active delivery.
export const liveLocationSchema = new Schema(
  {
    lat: Number,
    lng: Number,

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);