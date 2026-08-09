import { Address } from "./address";
import { DeliveryPartner } from "./delivery";
import { ORDER_STATUSES } from "@/lib/orderStatus";
import { OrderItem } from "./orderItem";
import { OrderUser } from "./orderUser";
import { LiveLocation } from "./liveLocation";
import { StatusHistory } from "./statusHistory";

export interface Order {
  _id: string;

  user: string | OrderUser;

  items: OrderItem[];

  shippingAddress: Omit<Address, "_id" | "isDefault">;

  liveLocation?: LiveLocation;

  paymentMethod: string;

  subtotal: number;

  deliveryFee: number;

  tax: number;

  total: number;

  status: (typeof ORDER_STATUSES)[number];

  statusHistory: StatusHistory[];

  deliveryPartner: DeliveryPartner | null;

  deliveryOtp: string;

  isPaid: boolean;

  stripeCheckoutSessionId?: string;

  stripePaymentIntentId?: string;

  createdAt: string;

  updatedAt?: string;

  __v?: number;
}
