import { NextRequest } from "next/server";
import { handleUpdateStatus } from "./handlers/updateStatus";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleUpdateStatus(request, context);
}
