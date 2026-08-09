// Individual address management endpoint.
//
// PUT    → Update address
// DELETE → Remove address

import { NextRequest } from "next/server";
import { handleDeleteAddress } from "./handlers/deleteAddress";
import { handleUpdateAddress } from "./handlers/updateAddress";

// Updates a customer's saved address.
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleUpdateAddress(request, context);
}


export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleDeleteAddress(request, context);
}
