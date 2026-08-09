// Customer wishlist endpoint
import { NextRequest } from "next/server";
import { handleGetWishlist } from "./handlers/getWishlist";
import { handleCreateWishlistItem } from "./handlers/createWishlistItem";

// GET  → Fetch wishlist
export async function GET() {
  return handleGetWishlist();
}

// POST → Add product to wishlist
export async function POST(request: NextRequest) {
  return handleCreateWishlistItem(request);
}
