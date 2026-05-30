import { Address } from "./address";
import { DeliveryPartner } from "./delivery";

export interface OrderItem {
  _id: string;

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
  _id: string;

  status: string;
  timestamp: string;
  note: string;
}

export interface LiveLocation {
  lat: number;
  lng: number;
  updatedAt: string;
}

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

  status: string;

  statusHistory: StatusHistory[];

  deliveryPartner: DeliveryPartner | null;

  deliveryOtp: string;

  isPaid: boolean;

  createdAt: string;

  updatedAt?: string;

  __v?: number;
}
