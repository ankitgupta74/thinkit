// Application Startup Flow:
//
// RootLayout
// → AuthProvider
// → CartProvider
// → Page Content
// → Global Notifications
//
// Every page automatically gets access to authentication, cart state and toasts.

import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart/CartProvider";
import AuthProvider from "@/context/auth/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Global metadata applied across the entire application.
export const metadata: Metadata = {
  // Default browser tab title.
  title: "Thinkit",
  // Basic description used by search engines and previews.
  description: "Grocery Delivery",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Makes authentication state available to every page and component. */}
        <AuthProvider>
          {/* Makes cart state available throughout the store. */}
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        {/* Global notification system used for success, error and informational messages. */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1B3022",
              color: "#fff",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
