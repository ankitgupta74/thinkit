// Delivery partner order dashboard endpoint.

import { NextRequest } from "next/server";
import { handleGetOrders } from "./handlers/getOrders";

// Returns orders assigned to the current rider.
export async function GET(request: NextRequest) {
  return handleGetOrders(request);
}
