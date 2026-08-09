// Auth Flow: Current user profile endpoint.

import { handleGetMe } from "./handlers/getMe";

// Returns information about the currently logged-in user.
export async function GET() {
  return handleGetMe();
}
