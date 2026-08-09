import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Order } from "@/types";
import toast from "react-hot-toast";

export function useOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const filteredOrders =
    activeTab === "all"
      ? orders
      : activeTab === "Active"
        ? orders.filter(
            (o) => o.status !== "Delivered" && o.status !== "Cancelled",
          )
        : orders.filter((o) => o.status === activeTab);

  // Load customer's order history.
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        // Fetch orders belonging to the logged-in user.
        const data = await api<{
          success: boolean;
          orders: Order[];
        }>("/orders");

        // Store orders for filtering and display.
        setOrders(data.orders);
      } catch (error) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load your orders. Please try again.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  return {
    loading,
    activeTab,
    setActiveTab,
    filteredOrders
  };
}
