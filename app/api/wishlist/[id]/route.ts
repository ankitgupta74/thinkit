import { NextRequest } from "next/server";
import { handleDeleteWishlistItem } from "./handlers/deleteWishlistItem";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleDeleteWishlistItem(request, context);
}