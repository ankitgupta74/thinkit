import { NextRequest } from "next/server";
import { handleDeleteSaveForLaterItem } from "./handlers/deleteSaveForLaterItem";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleDeleteSaveForLaterItem(request, context);
}