import mongoose, {
  Schema,
  models,
  model
} from "mongoose";

// Stores all saved delivery addresses of a customer.
// A user can have multiple addresses, but one can be marked as default.
const addressSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    zip: {
      type: String,
      required: true,
    },

    // Helps us quickly know which address should be pre-selected during checkout.
    isDefault: {
      type: Boolean,
      default: false,
    },

    // Coordinates are useful for delivery tracking, maps and distance calculations.
    lat: {
      type: Number,
      required: true,
    },

    lng: {
      type: Number,
      required: true,
    },

    // Connects this address to its owner (User collection).
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    // Automatically creates createdAt and updatedAt fields.
    timestamps: true,
  },
);

// Prevents model overwrite error during Next.js hot reload.
const Address = models.Address || model("Address", addressSchema);

export default Address;
