"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PlusIcon,
  PackageSearchIcon,
  ShoppingBagIcon,
  LogOutIcon,
  BarChart3Icon,
  ShieldIcon,
  Truck,
} from "lucide-react";
import Navbar from "@/components/navigation/Navbar";

export default function AdminLayout({
  children,
}: {
  // Any admin page will be rendered inside this layout
  children: React.ReactNode;
}) {
  // Central place for all admin navigation links.
  // Add, remove, or update sidebar items here.
  const AdminLinkData = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: BarChart3Icon,
    },
    {
      to: "/admin/products/new",
      label: "Add Product",
      icon: PlusIcon,
    },
    {
      to: "/admin/products",
      label: "Products",
      icon: PackageSearchIcon,
    },
    {
      to: "/admin/orders",
      label: "Orders",
      icon: ShoppingBagIcon,
    },
    {
      to: "/admin/deliveryPartners",
      label: "Delivery Partners",
      icon: Truck,
    },
    {
      to: "/",
      label: "Exit",
      icon: LogOutIcon,
    },
  ];

  // Gives the current URL path.
  // Used to highlight the active sidebar link.
  const pathname = usePathname();

  return (
    // Main admin layout wrapper
    <div className="h-screen overflow-hidden">
      {/* Show top navbar only on larger screens */}
      <div className="max-lg:hidden">
        <Navbar />
      </div>
      {/* Responsive layout: stacked on mobile, sidebar + content on larger screens */}
      <div className="flex flex-col h-full lg:flex-row gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Admin Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 h-fit bg-white rounded-2xl p-4 border border-app-border">
          {/* Admin section title */}
          <div className="pb-4 mb-4 border-b border-app-border">
            <h2 className="text-lg font-semibold text-app-green flex items-center gap-2 px-2">
              <ShieldIcon className="size-5 text-green-900" /> Admin Panel
            </h2>
          </div>
          {/* Navigation links generated from AdminLinkData */}
          <nav className="flex flex-col gap-1.5">
            {/* Create sidebar links from the configuration array */}
            {AdminLinkData.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className={`flex items-center gap-3 p-2.5 rounded-md text-sm transition-colors ${
                  // Highlight the link that matches the current page
                  pathname === link.to
                    ? "bg-app-green text-white"
                    : "text-app-text-light hover:bg-orange-50 hover:text-zinc-900"
                }`}
              >
                {/* Render the icon stored in the navigation object */}
                <link.icon className="size-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        {/* Main page content */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}
