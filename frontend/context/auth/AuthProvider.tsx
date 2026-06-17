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
    // Fetch current user information from the server.
    async function loadUser() {
      try {
        // Ask the backend who is currently authenticated.
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          // Save authenticated user in global state.
          setUser(data.user);
        } else {
          // No valid session found.
          setUser(null);
        }
      } catch {
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
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Clear server session and refresh local auth state.
  const logout = async () => {
    try {
      // Ask backend to remove authentication cookie.
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Update frontend state after logout completes.
      await refreshUser();
    } catch (error) {
      console.error(error);
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
