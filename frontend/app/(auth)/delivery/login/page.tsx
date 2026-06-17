"use client";

import { useState } from "react";
import { BikeIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DeliveryLogin() {
  // Stores the email entered by the delivery partner
  const [email, setEmail] = useState("");

  // Stores the password entered by the delivery partner
  const [password, setPassword] = useState("");

  // Used to show loading state during login request
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Login Flow:
  //
  // Submit Credentials
  // → Call Login API
  // → Receive Auth Cookie
  // → Redirect To Delivery Dashboard
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Ask backend to verify rider credentials.
      const response = await fetch("/api/deliveryPartners/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Login failed");
        return;
      }

      toast.success("Welcome back");

      // Login succeeded, move rider into the delivery workspace.
      router.push("/delivery");
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Split screen layout: branding section on large screens, login form section on the other side
    <div className="min-h-screen flex">
      {/* Left Side */}
      {/* Marketing/branding panel. Hidden on smaller screens to save space. */}
      <div className="hidden lg:flex lg:w-1/2 bg-app-green relative items-center justify-center">
        <Image
          // Decorative background image for visual appeal
          src="/assets/hero_bg.jpeg"
          alt="Delivery background"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover opacity-20"
          priority
        />
        <div className="relative text-center px-12">
          <h2 className="text-4xl font-semibold text-white mb-4">
            Delivery Partner Portal
          </h2>
          <p className="text-white/60 font-serif text-xl max-w-sm mx-auto">
            Manage your deliveries and keep customers happy.
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      {/* Login form container */}
      <div className="flex-1 flex-center px-4 py-12 bg-app-cream">
        <div className="w-full max-w-md">
          {/* App branding shown above the login form */}
          <div className="text-center mb-8">
            <div className="flex-center gap-2 mb-4">
              <BikeIcon className="size-7 text-app-green" />
              <span className="text-2xl font-semibold text-app-green">
                Instacart
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-app-green mb-2">
              Delivery Partner Login
            </h1>
            <p className="text-sm text-app-text-light">
              Sign in to manage your deliveries
            </p>
          </div>

          <form
            // All login inputs and submission logic live here
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-8 space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-app-green mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                // Controlled input: value comes from state and updates state on change
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border not-focus:border-app-border text-sm transition-colors"
                placeholder="partner@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-app-green mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                // Password field follows the same controlled input pattern
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border not-focus:border-app-border text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              // Prevent multiple login attempts while request is running
              disabled={loading}
              className="w-full py-3 bg-app-green text-white font-semibold rounded-xl hover:bg-app-green-light transition-colors disabled:opacity-60"
            >
              {
                loading
                  ? "Signing in..." // Show progress during login request
                  : "Sign In" // Default button text
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
