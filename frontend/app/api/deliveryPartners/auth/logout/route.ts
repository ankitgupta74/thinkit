// Delivery partner logout endpoint.

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Ends the delivery partner session.
export async function POST() {
  // Access cookies stored for the current request.
  const cookieStore = await cookies();

  // Remove authentication token by expiring the cookie.
  cookieStore.set("delivery-token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  // Confirm successful logout.
  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
