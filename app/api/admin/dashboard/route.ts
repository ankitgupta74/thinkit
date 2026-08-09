// Admin dashboard statistics endpoint.

import { handleGetDashboardStats } from "./handlers/getDashboardStats";

// Returns summary information for the admin dashboard.
export async function GET() {
  return handleGetDashboardStats();
}
