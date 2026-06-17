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

  // Reloads user information from the server.
  refreshUser: () => Promise<void>;

  // Ends the current user session.
  logout: () => Promise<void>;
}

// Creates a shared authentication container that can be accessed anywhere in the app.
export const AuthContext = createContext<AuthContextType | null>(null);
