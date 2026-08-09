import { NextRequest } from "next/server";
import { handleGetProduct } from "./handlers/getProduct";
import { handleUpdateProduct } from "./handlers/updateProduct";
import { handleDeleteProduct } from "./handlers/deleteProduct";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleGetProduct(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleUpdateProduct(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleDeleteProduct(request, context);
}
