// Order details and order management endpoint.

// Supports:
// GET    → View order details
// PATCH  → Cancel order
// DELETE → Permanently remove order (Admin)

import { NextRequest } from "next/server";
import { handleGetOrder } from "./handlers/getOrder";
import { handleCancelOrder } from "./handlers/cancelOrder";
import { handleDeleteOrder } from "./handlers/deleteOrder";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleGetOrder(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleCancelOrder(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleDeleteOrder(request, context);
}
