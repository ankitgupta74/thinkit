// Admin order management endpoint.
import { handleGetAllOrders } from "./handlers/getAllOrders";

// API Flow:
// Admin Request
// → Verify Admin Access
// → Fetch Orders
// → Include User & Rider Details
// → Return Results

// Admin endpoint for viewing all orders in the system.
// Used for order management and monitoring.
export async function GET() {
  return handleGetAllOrders();
}
