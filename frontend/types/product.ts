export interface Product {
  _id: string;
  name: string;
  description: string;

  price: number;
  originalPrice: number;

  image: string;
  category: string;

  unit: string;
  stock: number;

  isOrganic: boolean;

  rating: number;
  reviewCount: number;

  discount: number;

  createdAt: string;
}
