// Auth Flow: Current user profile endpoint.
// Read Token Cookie → Find User → Remove Sensitive Fields → Return Safe User Data

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { serverError } from "@/lib/apiError";

// Returns information about the currently logged-in user.
export async function GET() {
  try {
    // Read the user linked to the authentication token.
    const user = await getAuthUser();

    // User must be logged in to access profile information.
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // Create a safe copy before sending data to the frontend.
    const userData = { ...user };
    delete userData.password; // Never expose password data in API responses.

    // Return authenticated user information to the frontend.
    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    // Handle unexpected authentication or server failures.
    console.error(error);

    // Reuse the application's standard error response format.
    return serverError(error);
  }
}
