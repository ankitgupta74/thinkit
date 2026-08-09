// Customer order tracking endpoint.

import { NextRequest } from "next/server";
import { handleGetLocation } from "./handlers/getLocation";

// Returns live delivery tracking information for a specific customer order.
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleGetLocation(request, context);
}
