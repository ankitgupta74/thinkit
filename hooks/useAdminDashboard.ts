import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface RecentOrder {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
  items?: {
    _id: string;
  }[];
}

// Defines the shape of dashboard data so TypeScript knows what to expect
interface Stats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  outOfStock: number;
  totalPartners: number;
  recentOrders: RecentOrder[];
}

// Dashboard Flow:
//
// Fetch Dashboard Data
// → Build Summary Cards
// → Show Recent Orders
// → Navigate To Management Pages

export function useAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load dashboard statistics and recent activity.
    const fetchDashboard = async () => {
      try {
        // Fetch admin dashboard data from backend.
        const data = await api<Stats & { success: boolean }>(
          "/admin/dashboard",
        );

        // Store dashboard data for cards and tables.
        setStats(data);
      } catch (error) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load dashboard. Please try again.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { stats, loading };
}
