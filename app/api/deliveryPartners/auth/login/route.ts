// Delivery partner authentication endpoint.

import { NextRequest } from "next/server";
import { handleLoginPartner } from "./handlers/loginPartner";

// Authenticates a delivery partner.
export async function POST(request: NextRequest) {
  return handleLoginPartner(request);
}
