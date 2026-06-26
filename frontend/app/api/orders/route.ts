import { NextRequest } from "next/server";
import { handleGetUserOrders } from "./handlers/getUserOrders";
import { handleCreateOrder } from "./handlers/createOrder";

export async function GET() {
  return handleGetUserOrders();
}

export async function POST(request: NextRequest) {
  return handleCreateOrder(request);
}
