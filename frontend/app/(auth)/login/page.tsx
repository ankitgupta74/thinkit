"use client";

/* 
  Authentication Page
  Handles:
  - Login mode
  - Registration mode
  - Form state
  - Loading state
  - Future API integration
*/

// Authentication Architecture:
//
// Login/Register Form
// → Auth API
// → Cookie Created
// → refreshUser()
// → AuthContext Updated
// → Entire App Receives User State

import {
  Loader2Icon,
  LockIcon,
  MailIcon,
  ShoppingBasket,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuthForm } from "@/hooks/useAuthForm";

function Login() {
  const {
    isLoginState,
    setIsLoginState,
    name,
    setName,
    password,
    setPassword,
    email,
    setEmail,
    loading,
    authLoading,
    user,
    handleSubmit,
  } = useAuthForm();

  // Wait until authentication status is known.
  if (authLoading) {
    return null;
  }

  // Redirect logic handles authenticated users.
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Hero Section - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-app-green relative items-center justify-center">
        <Image
          src="/assets/hero_bg.jpeg"
          alt="Fresh groceries"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover opacity-20"
          priority
        />
        <div className="relative text-center px-12 z-10">
          <h2 className="text-5xl font-semibold text-white mb-4">
            Welcome back to Thinkit
          </h2>
          <p className="text-white/80 font-serif text-xl max-w-sm mx-auto">
            Fresh groceries and organic produce, delivered to your doorstep.
          </p>
        </div>
      </div>
      {/* Authentication Form Section */}
      <div className="flex-1 flex-center px-4 py-12 bg-app-cream">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <ShoppingBasket className="size-8 text-app-green" />
              <span className="text-2xl font-semibold text-app-green">
                Thinkit
              </span>
            </Link>
            <h1 className="text-2xl font-semibold text-app-green mb-2">
              {isLoginState
                ? "Sign in to your account"
                : "Sign up for an account"}
            </h1>
            <p className="text-sm text-app-text-light">
              {isLoginState
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                type="button"
                className="text-orange-500 ml-1 font-semibold hover:text-orange-600 transition-colors"
                onClick={() => setIsLoginState(!isLoginState)}
              >
                {isLoginState ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginState && (
              /* Render only during registration */
              <label htmlFor="" className="text-sm flex flex-col gap-1">
                Name
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"
                  />
                </div>
              </label>
            )}
            <label htmlFor="" className="text-sm flex flex-col gap-1">
              Email Address
              <div className="relative">
                <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="thinkit@example.com"
                  className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"
                />
              </div>
            </label>
            <label htmlFor="" className="text-sm flex flex-col gap-1">
              Password
              <div className="relative">
                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="12345678"
                  className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"
                />
              </div>
            </label>
            {/* Auth submit button with loading state */}
            <button
              type="submit"
              disabled={loading}
              className="flex-center w-full py-3 bg-green-950 text-white font-semibold rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2Icon className="animate-spin" />
              ) : isLoginState ? (
                "Sign In"
              ) : (
                "Sign up"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
