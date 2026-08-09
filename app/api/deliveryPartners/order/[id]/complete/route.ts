import { NextRequest } from "next/server";
import { handleCompleteOrder } from "./handlers/completeOrder";

// Completes one assigned delivery after customer OTP verification.
export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  return handleCompleteOrder(request, context);
}
