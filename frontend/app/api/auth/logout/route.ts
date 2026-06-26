// Auth Flow: Authentication endpoint.

import { handleLogoutUser } from "./handlers/logoutUser";

// Ends the user's session by removing the login token.
export async function POST() {
  return handleLogoutUser();
}
