// Delivery partner status update endpoint.

import { NextRequest } from "next/server";
import { handleUpdateStatus } from "./handlers/updateStatus";

// PUT /api/deliveryPartners/order/:id/status
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleUpdateStatus(request, context);
}
