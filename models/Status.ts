import { Schema } from "mongoose";

// Keeps a timeline of order progress for tracking and auditing.
export const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    note: {
      type: String,
      default: "",
    },
  },
  {
    _id: true,
  },
);
