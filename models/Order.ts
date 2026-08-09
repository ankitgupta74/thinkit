import mongoose, {
  Schema,
  models,
  model
} from "mongoose";
import { statusHistorySchema } from "./Status";
import { liveLocationSchema } from "./LiveLocation";
import { shippingAddressSchema } from "./ShippingAddress";
import { orderItemSchema } from "./OrderItem";

// Central order document containing customer,
// products, payment details and delivery tracking.
const orderSchema = new Schema(
  {
    // Customer who placed the order.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // All purchased products in this order.
    items: {
      type: [orderItemSchema],
      required: true,
    },

    // Delivery location selected during checkout.
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    // Updated while the delivery partner is on the way.
    liveLocation: liveLocationSchema,

    paymentMethod: {
      type: String,
      required: true,
    },

    // Product total before taxes and delivery charges.
    subtotal: {
      type: Number,
      required: true,
    },

    deliveryFee: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    // Final amount customer needs to pay.
    total: {
      type: Number,
      required: true,
    },

    // Current stage of the order lifecycle.
    status: {
      type: String,
      default: "Placed",
      index: true,
    },

    // Complete history of status changes.
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },

    // Assigned delivery rider for this order.
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
      default: null,
    },

    // OTP can be used to verify successful delivery.
    deliveryOtp: {
      type: String,
      default: "",
    },

    // Tracks whether payment has been completed.
    isPaid: {
      type: Boolean,
      default: false,
    },

    // Stripe Checkout Session created for card-payment orders.
    stripeCheckoutSessionId: {
      type: String,
      default: "",
      index: true,
    },

    // Stripe Payment Intent created after Checkout payment succeeds.
    stripePaymentIntentId: {
      type: String,
      default: "",
      index: true,
    },
  },
  {
    // Automatically creates createdAt and updatedAt fields.
    timestamps: true,
  },
);

// Prevents model overwrite issues during development.
const Order = models.Order || model("Order", orderSchema);

export default Order;
