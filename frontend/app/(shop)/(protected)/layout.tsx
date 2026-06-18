// Protection Flow:
//
// Check AuthContext
// → Verify User
// → Redirect Guest
// → Render Protected Pages

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/auth/useAuth";
import Loader from "@/components/ui/Loader";

// Protects routes that require authentication.
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Global authentication state.
  const { user, loading } = useAuth();

  // Redirect guests to login page.
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Wait until authentication status is known.
  if (loading) {
    return (
      <div className="min-h-screen flex-center flex-col gap-4">
        <Loader />
      </div>
    );
  }

  // Redirect logic will handle unauthenticated users.
  if (!user) {
    return null;
  }

  // Render protected content for authenticated users.
  return <>{children}</>;
}
