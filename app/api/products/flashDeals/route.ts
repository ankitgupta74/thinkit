import { handleGetFlashDeals } from "./handlers/getFlashDeals";

export async function GET() {
  return handleGetFlashDeals();
}
