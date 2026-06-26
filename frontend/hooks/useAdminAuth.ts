import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/useAuth";

export function useAdminAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Protect admin routes from guests and non-admin users.
  useEffect(() => {
    // Guest users must login first.
    if (!loading && !user) {
      router.replace("/login");
    }

    // Logged-in users without admin rights cannot access admin pages.
    if (!loading && user && !user.isAdmin) {
      router.replace("/");
    }
  }, [loading, user, router]);

  return { user, loading, pathname };
}
