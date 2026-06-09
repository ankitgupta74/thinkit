import { cookies } from "next/headers";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";

// Shape of the data we store inside the JWT token.
type JwtPayload = {
  id: string;
};

// Finds the currently logged-in user using the token stored in cookies.
export async function getAuthUser() {
  // User data is stored in MongoDB, so we need a database connection first.
  await connectDB();

  // Read browser cookies sent with the request.
  const cookieStore = await cookies();

  // Authentication token created during login.
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    // Decode the token to find which user is logged in
    const decoded = verifyToken(token) as JwtPayload;

    // Fetch the user linked to the token.
    const user = await User.findById(decoded.id).lean();

    return user;
  } catch {
    // Invalid or expired token means user is not authenticated.
    return null;
  }
}
