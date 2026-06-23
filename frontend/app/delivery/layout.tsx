// Delivery Access Flow:
//
// Verify Session
// → Load Partner Profile
// → Render Delivery Pages
// → Logout When Needed

"use client";

import { LogOutIcon, TruckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DeliveryPartner } from "@/types";
import Loader from "@/components/ui/Loader";
import { api } from "@/lib/api";

export default function DeliveryLayout({
  children,
}: {
  // Any delivery page will be rendered here
  children: React.ReactNode;
}) {
  // Used for page navigation without refreshing the browser
  const router = useRouter();

  // Logged-in delivery partner information loaded from backend.
  const [partner, setPartner] = useState<DeliveryPartner | null>(null);

  // Prevent layout from rendering before auth check finishes.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify delivery partner session and load profile.
    const fetchPartner = async () => {
      try {
        // Check whether a delivery partner is currently logged in.
        const data = await api<{
          success: boolean;
          partner: DeliveryPartner;
        }>("/deliveryPartners/auth/me");

        setPartner(data.partner);
      } catch (error) {
        console.error(error);

        // Invalid session → return to delivery login page.
        router.push("/delivery/login");
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [router]);

  // End delivery partner session.
  const handleLogout = async () => {
    try {
      // Remove the delivery-token cookie.
      await api<{
        success: boolean;
      }>("/deliveryPartners/auth/logout", {
        method: "POST",
      });

      // Return rider to delivery login after logout.
      router.push("/delivery/login");
    } catch (error) {
      console.error(error);
    }
  };

  // Don't render the layout until partner data is available
  if (loading || !partner) {
    return (
      <div className="min-h-screen flex-center flex-col gap-4">
        <Loader />
      </div>
    );
  }

  return (
    // Main wrapper that stays around all delivery pages
    <div className="min-h-screen bg-app-cream">
      {/* Shared top navigation bar shown on every delivery page */}
      {/* Sticky header stays visible while scrolling */}
      <header className="bg-white border-b border-app-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* App branding/logo area */}
          <div className="flex items-center gap-2">
            <TruckIcon className="size-6 text-app-green" />
            <span className="text-lg font-semibold text-app-green">
              Thinkit Delivery
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Shows currently logged-in delivery partner */}
            <span className="text-sm font-medium text-zinc-600">
              {partner.name}
            </span>
            <button
              aria-label="Logout"
              type="button"
              // Logout and return to login page
              onClick={handleLogout}
              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOutIcon className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Page content area below the header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        <main className="flex-1 min-w-0">
          {/* Render whichever delivery page is currently active */}
          {children}
        </main>
      </div>
    </div>
  );
}
