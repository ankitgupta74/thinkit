// Admin endpoint for updating delivery partner information.

import { NextRequest } from "next/server";
import { handleUpdatePartner } from "./handlers/updatePartner";

// Updates an existing delivery partner account.
export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  return handleUpdatePartner(request, context);
}
