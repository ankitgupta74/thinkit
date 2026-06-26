import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

// Login Flow:
//
// Submit Credentials
// → Call Login API
// → Receive Auth Cookie
// → Redirect To Delivery Dashboard

export function useDeliveryLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Ask backend to verify rider credentials.
      // Shared helper sends JSON, includes cookies, and throws backend errors.
      await api<{
        success: boolean;
        partner: {
          _id: string;
          name: string;
          email: string;
        };
      }>("/deliveryPartners/auth/login", {
        method: "POST",
        body: {
          email,
          password,
        },
      });

      toast.success("Welcome back");

      // Login succeeded, move rider into the delivery workspace.
      router.push("/delivery");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, loading, handleSubmit };
}
