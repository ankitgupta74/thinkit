import { NextRequest } from "next/server";
import { handleRegisterUser } from "./handlers/registerUser";

export async function POST(request: NextRequest) {
  return handleRegisterUser(request);
}
