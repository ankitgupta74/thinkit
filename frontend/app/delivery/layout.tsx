"use client";

import { LogOutIcon, TruckIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { dummyDeliveryPartnerData } from "@/public/assets";
import { DeliveryPartner } from "@/types";

export default function DeliveryLayout({
  children,
}: {
  // Any delivery page will be rendered here
  children: React.ReactNode;
}) {
  // Used for page navigation without refreshing the browser
  const router = useRouter();

  // Currently using dummy partner data.
  // Later this can come from an API, context, or authentication system.
  const [partner] = useState<DeliveryPartner>(dummyDeliveryPartnerData[0]);

  const handleLogout = () => {
    // Redirect user back to login page after logout
    router.push("/delivery/login");
  };

  // Don't render the layout until partner data is available
  if (!partner) return null;

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
