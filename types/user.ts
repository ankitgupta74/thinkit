import { Address } from "./address";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
  isAdmin?: boolean;

  createdAt: string;
  updatedAt: string;
}
