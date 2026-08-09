import { Product } from "./product";

export interface WishlistItem {
  _id: string;
  // User ID
  user: string;
  // Product
  product: string | Product;
  createdAt: string;
  updatedAt: string;
}