// Provides authentication state to the entire application.

// Authentication Lifecycle:
//
// App Starts
// → Load Current User
// → Store User In Context
// → Components Read Context
// → Login / Logout Updates Context

"use client";

import {
  useEffect,
  useState
} from "react";
import type { User } from "@/types/user";
import { AuthContext } from "./authContext";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

// Components wrapped inside AuthProvider can access authentication state.
interface Props {
  children: React.ReactNode;
}

// Loads and manages the current user's session.
export default function AuthProvider({ children }: Props) {
  // Stores the currently authenticated user.
  const [user, setUser] = useState<User | null>(null);

  // Prevents UI from rendering auth-dependent content before authentication is checked.
  const [loading, setLoading] = useState(true);

  // Check whether the user is already logged in when the application starts.
  useEffect(() => {
    async function loadUser() {
      try {
        // Ask the backend which customer owns the current session.
        const data = await api<{
          success: boolean;
          user: User;
        }>("/auth/me");

        // Save authenticated user in global state.
        setUser(data.user);
      } catch {
        // Missing, expired, or invalid session means no customer is logged in.
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []); // no deps now, so no warning

  // Manually reload authentication state.
  // Useful after login, profile updates or logout.
    const refreshUser = async () => {
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

  // Clear server session and refresh local auth state.
    const logout = async () => {
      try {
        // Ask backend to remove the customer authentication cookie.
        await api<{
          success: boolean;
        }>("/auth/logout", {
          method: "POST",
        });

        toast("Logged Out Successfully");
      } catch (error) {
        // Even if the server session is already gone, clear local auth state.
        console.error(error);
      } finally {
        // Remove customer data immediately from the frontend session.
        setUser(null);
        setLoading(false);
      }
    };

  return (
    // Make authentication state available to all child components.
    <AuthContext.Provider
      // Shared authentication data and actions.
      value={{
        user,
        loading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
