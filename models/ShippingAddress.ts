// Snapshot of delivery address at order creation.

import { Schema } from "mongoose";

// Prevents future address edits from affecting past orders.
export const shippingAddressSchema = new Schema(
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
