// Customer address management endpoint.
//
// GET  → Fetch saved addresses
// POST → Create a new address

import { NextRequest } from "next/server";
import { handleGetAddresses } from "./handlers/getAddresses";
import { handleCreateAddress } from "./handlers/createAddress";

// GET → Fetch saved addresses
export async function GET() {
  return handleGetAddresses();
}

// POST → Create a new address
export async function POST(request: NextRequest) {
  return handleCreateAddress(request);
}
