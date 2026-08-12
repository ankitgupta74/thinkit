import { NextRequest } from "next/server";
import { handleGetReviews } from "./handlers/getReviews";
import { handleCreateReview } from "./handlers/createReview";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleGetReviews(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleCreateReview(request, context);
}
