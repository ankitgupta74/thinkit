// Manually reload authentication state.

import { api } from "@/lib/api";
import { User } from "@/types";

// Useful after login, profile updates or logout.
export const refreshUser = async (
  setUser: (user: User | null) => void,
  setLoading: (loading: boolean) => void,
) => {
  // Show loading state while refreshing session data.
  setLoading(true);

  try {
    // Reload the current customer from the server session.
    const data = await api<{
      success: boolean;
      user: User;
    }>("/auth/me");

    setUser(data.user);
  } catch {
    // The session no longer exists or is no longer valid.
    setUser(null);
  } finally {
    setLoading(false);
  }
};
