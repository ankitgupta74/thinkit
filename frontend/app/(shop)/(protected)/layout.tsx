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
    // Guest users must leave before protected page content can render.
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Do not mount protected child pages until customer authentication is confirmed.
  if (loading || !user) {
    return (
      <div className="min-h-screen flex-center flex-col gap-4">
        <Loader />
      </div>
    );
  }

  // Render protected content for authenticated users.
  return <>{children}</>;
}
