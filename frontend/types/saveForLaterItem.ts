import { Product } from "./product";

export interface SaveForLaterItem {
  _id: string;

  // User ID
  user: string;

  // Saved product
  product: string | Product;

  createdAt: string;

  updatedAt: string;
}
