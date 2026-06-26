import { NextRequest } from "next/server";
import { handleGetProducts } from "./handlers/getProducts";
import { handleCreateProduct } from "./handlers/createProduct";

export async function GET(request: NextRequest) {
  return handleGetProducts(request);
}

export async function POST(request: NextRequest) {
  return handleCreateProduct(request);
}
