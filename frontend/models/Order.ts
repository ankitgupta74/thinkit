import mongoose, {
  Schema,
  models,
  model
} from "mongoose";

// Snapshot of products at the time of purchase.
// We store product details here so old orders remain accurate even if product information changes later.
const orderItemSchema = new Schema(
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

// Keeps a timeline of order progress for tracking and auditing.
const statusHistorySchema = new Schema(
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

// Real-time delivery partner location used during active delivery.
const liveLocationSchema = new Schema(
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

// Snapshot of delivery address at order creation.
// Prevents future address edits from affecting past orders.
const shippingAddressSchema = new Schema(
  {
    label: String,

    address: String,

    city: String,

    state: String,

    zip: String,

    lat: Number,

    lng: Number,
  },
  {
    _id: false,
  },
);

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
  },
  {
    // Automatically creates createdAt and updatedAt fields.
    timestamps: true,
  },
);

// Prevents model overwrite issues during development.
const Order = models.Order || model("Order", orderSchema);

export default Order;
