import { NextResponse } from "next/server";

// Common helper for handling unexpected server errors.
// Keeps API responses consistent across the project.
export function serverError(error: unknown) {
  // Log the actual error for debugging purposes.
  console.error(error);

  // Return a safe error message to the client.
  return NextResponse.json(
    {
      success: false,
      message: "Internal server error",
    },
    {
      status: 500,
    },
  );
}
