import {
  model,
  models,
  Schema
} from "mongoose";

// Stores delivery riders/drivers who handle order deliveries.
const deliveryPartnerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    // Vehicle type can later help with delivery assignment logic.
    vehicleType: {
      type: String,
      enum: ["bike", "scooter", "car"],
      default: "bike",
    },

    // Allows admin to temporarily disable a delivery partner without deleting the account.
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically creates createdAt and updatedAt fields.
    timestamps: true,
  },
);

// Reuse existing model during development reloads.
const DeliveryPartner =
  models.DeliveryPartner ||
  model("DeliveryPartner", deliveryPartnerSchema);

export default DeliveryPartner;
