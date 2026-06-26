// Returns information about the currently logged-in delivery partner.

import { handleGetMe } from "./handlers/getMe";

// Used by the delivery dashboard to identify the current rider.
export async function GET() {
  return handleGetMe();
}
