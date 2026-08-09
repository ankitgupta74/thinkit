// Delivery partner management endpoint.
//
// GET  → List delivery partners
// POST → Create delivery partner

import { NextRequest } from "next/server";
import { handleGetPartners } from "./handlers/getPartner";
import { handleCreatePartner } from "./handlers/createPartner";

// Returns all delivery partners for admin management.
export async function GET() {
  return handleGetPartners();
}

// Creates a new delivery partner account.
export async function POST(request: NextRequest) {
  return handleCreatePartner(request);
}
