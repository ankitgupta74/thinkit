import mongoose, {
  model,
  models,
  Schema
} from "mongoose";

// A user can have multiple unique save for later items.
const saveForLaterItemSchema = new Schema(
  {
    // Connects this save for later item to its owner (User collection).
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // IXSCAN
    },
    // Connects this save for later item to its source (Product collection).
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
  },
  {
    // Automatically creates createdAt and updatedAt fields.
    timestamps: true,
  },
);

// A user cannot save the same product for later more than once.
saveForLaterItemSchema.index(
  {
    user: 1,
    product: 1,
  },
  {
    unique: true,
  },
);

// Prevents model overwrite error during Next.js hot reload.
const SaveForLaterItem = models.SaveForLaterItem || model("SaveForLaterItem", saveForLaterItemSchema);

export default SaveForLaterItem;