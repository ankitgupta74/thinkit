import { useState, useEffect } from "react";
import type { DeliveryPartner, Order } from "@/types";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

// Admin Order Flow:
//
// Load Orders
// → Assign Rider
// → Update Status
// → Sync UI With Backend

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState("");

  useEffect(() => {
    // Load orders and delivery partners needed for management screen.
    const fetchData = async () => {
      try {
        // Fetch all customer orders.
        const [ordersData, partnersData] = await Promise.all([
          api<{
            success: boolean;
            orders: Order[];
          }>("/orders/all"),

          api<{
            success: boolean;
            partners: DeliveryPartner[];
          }>("/deliveryPartners"),
        ]);

        setOrders(ordersData.orders);
        setPartners(partnersData.partners);
      } catch (error) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load orders. Please try again.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update order progress status.
  const handleStatusChange = async (id: string, newStatus: Order["status"]) => {
    try {
      // Send selected status to backend.
      await api(`/orders/${id}/status`, {
        method: "PUT",
        body: {
          status: newStatus,
        },
      });

      // Reflect status change instantly in UI.
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order,
        ),
      );

      toast.success("Status updated");
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to change status. Please try again.";

      toast.error(message);
    }
  };

  // Assign selected rider to current order.
  const handleAssign = async () => {
    if (!assignModal || !selectedPartner) return;

    try {
      // Create rider-order relationship in database.
      const data = await api<{
        success: boolean;
        order: Order;
      }>(`/orders/${assignModal}/assign`, {
        method: "PUT",
        body: {
          partnerId: selectedPartner,
        },
      });

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) => (order._id === assignModal ? data.order : order)),
        );

        toast.success("Delivery partner assigned");

        setAssignModal(null);
        setSelectedPartner("");
      }
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to assign partner. Please try again.";

      toast.error(message);
    }
  };

  return {
    orders,
    partners,
    loading,
    assignModal,
    setAssignModal,
    selectedPartner,
    setSelectedPartner,
    handleStatusChange,
    handleAssign,
  };
}
