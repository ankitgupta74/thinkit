import { Address } from "./address";
import { DeliveryPartner } from "./delivery";

export interface OrderItem {
  product: string;

  name: string;
  image: string;

  price: number;
  quantity: number;

  unit: string;
}

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface StatusHistory {
  status: string;
  timestamp: string;
  note: string;
}

export interface Order {
  _id: string;

  user: string | OrderUser;

  items: OrderItem[];

  shippingAddress: Omit<Address, "_id" | "isDefault">;

  paymentMethod: string;

  subtotal: number;

  deliveryFee: number;

  tax: number;

  total: number;

  status: string;

  statusHistory: StatusHistory[];

  deliveryPartner: DeliveryPartner | null;

  deliveryOtp: string;

  isPaid: boolean;

  createdAt: string;
}
