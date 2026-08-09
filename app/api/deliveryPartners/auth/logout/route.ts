// Delivery partner logout endpoint.

import { handleLogoutPartner } from "./handlers/logoutPartner";

// Ends the delivery partner session.
export async function POST() {
  return handleLogoutPartner();
}
