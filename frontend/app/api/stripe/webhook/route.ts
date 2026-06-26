import { NextRequest } from "next/server";
import { handleStripeWebhook } from "../handlers/handleWebhook";

// Updates a pending card order when Stripe reports that Checkout did not finish.
export async function POST(request: NextRequest) {
  return handleStripeWebhook(request);
}
