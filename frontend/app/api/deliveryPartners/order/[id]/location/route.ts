// Delivery partner live-location update endpoint.

import { NextRequest } from "next/server";
import { handleUpdateLocation } from "./handlers/updateLocation";

// PUT /api/deliveryPartners/order/:id/location
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleUpdateLocation(request, context);
}
