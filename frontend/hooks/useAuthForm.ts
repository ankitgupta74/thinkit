import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/useAuth";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export function useAuthForm() {
  const [isLoginState, setIsLoginState] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  // Prevent logged-in users from visiting the auth page again.
  useEffect(() => {
    // Logged-in customers should not remain on the login page.
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  /* Form Submit Handler */
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Choose login or registration endpoint based on current mode.
      const endpoint = isLoginState ? "/auth/login" : "/auth/register";

      // Build request body expected by the backend API.
      const payload = isLoginState
        ? {
            email,
            password,
          }
        : {
            name,
            email,
            password,
          };

      const toastMessage = isLoginState
        ? "Logged In Successfully"
        : "Registered Successfully";

      // Send authentication request to the server.
      // Shared helper keeps customer authentication requests consistent.
      await api<{
        success: boolean;
        user: {
          _id: string;
          name: string;
          email: string;
          isAdmin: boolean;
        };
      }>(endpoint, {
        method: "POST",
        body: payload,
      });

      // Sync AuthContext with the newly created session.
      await refreshUser();

      // Move user into the storefront after authentication.
      router.push("/");
      router.refresh();
      toast(toastMessage);
    } catch (error) {
      // api() throws backend error messages, so the form can show them here.
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : isLoginState
            ? "Login failed"
            : "Registration failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
