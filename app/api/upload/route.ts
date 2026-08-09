import { NextRequest } from "next/server";
import { handleUploadImage } from "./handlers/uploadImage";

export async function POST(request: NextRequest) {
  return handleUploadImage(request);
}
