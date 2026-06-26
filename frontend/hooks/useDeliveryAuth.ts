import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DeliveryPartner } from "@/types";
import { api } from "@/lib/api";

export function useDeliveryAuth() {
  const router = useRouter();
  const [partner, setPartner] = useState<DeliveryPartner | null>(null);
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

  return { partner, loading, handleLogout };
}
