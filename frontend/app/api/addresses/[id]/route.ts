// Individual address management endpoint.
//
// PUT    → Update address
// DELETE → Remove address

import { NextRequest } from "next/server";
import { handleDeleteAddress } from "./handlers/deleteAddress";
import { handleUpdateAddress } from "./handlers/updateAddress";

// Dynamic route parameters from the URL.
interface Params {
  params: Promise<{
    id: string;
  }>;
}

// Updates a customer's saved address.
export async function PUT(request: NextRequest, { params }: Params) {
  return handleUpdateAddress(request, { params });
}


export async function DELETE(request: NextRequest, { params }: Params) {
  return handleDeleteAddress(request, { params });
}
