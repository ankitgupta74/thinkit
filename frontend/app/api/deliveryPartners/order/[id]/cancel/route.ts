import { NextRequest } from "next/server";
import { handleCancelOrder } from "./handlers/cancelOrder";

// Cancels one assigned delivery and records the rider's reason.
export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  return handleCancelOrder(request, context);
}
