// Admin endpoint for manually assigning delivery riders.

import { NextRequest } from "next/server";
import { handleAssignRider } from "./handlers/assignRider";

// Allows admins to assign a rider to a specific order.
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleAssignRider(request, context);
}
