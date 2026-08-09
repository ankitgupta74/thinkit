import { NextRequest } from "next/server";
import { handleLoginUser } from "./handlers/loginUser";

export async function POST(request: NextRequest) {
  return handleLoginUser(request);
}
