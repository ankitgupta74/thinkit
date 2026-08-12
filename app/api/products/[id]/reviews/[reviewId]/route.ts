import { NextRequest } from "next/server";
import { handleUpdateReview } from "./handlers/updateReview";
import { handleDeleteReview } from "./handlers/deleteReview";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; reviewId: string }> },
) {
  return handleUpdateReview(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; reviewId: string }> },
) {
  return handleDeleteReview(request, context);
}
