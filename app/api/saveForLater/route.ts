// Customer wishlist endpoint
import { NextRequest } from "next/server";
import { handleGetAllSaveForLaterItems } from "./handlers/getSaveForLater";
import { handleCreateSaveForLaterItem } from "./handlers/createSaveForLater";


// GET  → Fetch Save For Later
export async function GET() {
  return handleGetAllSaveForLaterItems();
}

// POST → Add product to Save For Later
export async function POST(request: NextRequest) {
  return handleCreateSaveForLaterItem(request);
}
