// Central authentication state shared across the application.

// Auth Flow:
// AuthProvider → AuthContext → useAuth() → Components

import { createContext } from "react";
import type { User } from "@/types/user";

// Defines everything authentication-related that components can access through the context.
export interface AuthContextType {
  // Currently logged-in user.
  user: User | null;

  // Indicates whether authentication data is still loading.
  loading: boolean;

  // Reloads the current customer session through the shared API helper.
  refreshUser: () => Promise<void>;

  // Ends the current customer session and clears local auth state.
  logout: () => Promise<void>;
}

// Creates a shared authentication container that can be accessed anywhere in the app.
export const AuthContext = createContext<AuthContextType | null>(null);
