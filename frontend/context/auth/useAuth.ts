// Custom hook for accessing authentication state.

// Authentication Flow:
//
// Browser Cookie
// → /api/auth/me
// → AuthProvider
// → AuthContext
// → useAuth()
// → Components

"use client";

import { useContext } from "react";
import { AuthContext } from "./authContext";

// Simplifies access to AuthContext without importing useContext everywhere.
export function useAuth() {
  // Read authentication data from the nearest AuthProvider.
  const context = useContext(AuthContext);

  // Prevent usage outside the AuthProvider tree.
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  // Return authentication state and actions.
  return context;
}
