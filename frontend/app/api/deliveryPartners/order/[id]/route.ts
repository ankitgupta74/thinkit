import { NextRequest } from "next/server";
import { handleGetOrder } from "./handlers/getOrder";

// Returns orders assigned to the current rider.
export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  return handleGetOrder(request, context);
}
