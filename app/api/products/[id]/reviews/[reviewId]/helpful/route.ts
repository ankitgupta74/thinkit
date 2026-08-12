import { NextRequest } from "next/server";
import { handleToggleHelpful } from "./handlers/toggleHelpful";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ reviewId: string }> },
) {
  return handleToggleHelpful(request, context);
}
