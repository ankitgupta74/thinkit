// Auth Flow: Authentication endpoint.
// Logout Request → Delete Token Cookie → User Session Ends

import { NextResponse } from "next/server";

// Ends the user's session by removing the login token.
export async function POST() {
  // Prepare the success response before clearing authentication data.
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Remove the authentication cookie so future requests are treated as logged out.
  response.cookies.set("token", "", {
    // Prevent JavaScript from accessing the cookie.
    httpOnly: true,
    // Expire the cookie immediately.
    expires: new Date(0),
    // Remove the cookie across the entire application.
    path: "/",
  });

  // Send logout confirmation back to the client.
  return response;
}
