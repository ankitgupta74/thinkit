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
import { refreshUser as refreshUserAction } from "./functions/refreshUser";
import { logout as logoutAction } from "./functions/logout";

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

  // Create local wrapper functions to pass down into the context
  const refreshUser = async () => refreshUserAction(setUser, setLoading);
  const logout = async () => logoutAction(setUser, setLoading);

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
