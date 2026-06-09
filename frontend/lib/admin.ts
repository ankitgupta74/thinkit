import { getAuthUser } from "./auth";

// Checks whether an email belongs to an admin.
// Useful when admin access is controlled through environment variables.
export function isAdminEmail(email: string) {
  // Convert comma-separated emails into an array for easy lookup.
  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",").map((email) =>
      email.trim().toLowerCase(),
    ) || [];

  return adminEmails.includes(email.toLowerCase());
}

// Returns the logged-in user only if they have admin access.
// Used to protect admin routes and admin APIs.
export async function getAdminUser() {
  // First verify that a user is logged in.
  const user = await getAuthUser();

  if (!user) {
    return null;
  }

  // Admin access can come from database role or environment configuration.
  const isAdmin = user.isAdmin || isAdminEmail(user.email);

  if (!isAdmin) {
    return null;
  }

  return user;
}
