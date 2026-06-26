import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart/useCart";
import { api } from "@/lib/api";
import type { Address } from "@/types";
import toast from "react-hot-toast";

export function useCheckout() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [step, setStep] = useState("address");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const deliveryFee = cartTotal > 149 ? 0 : 49;
  const tax = cartTotal * 0.08;
  const total = cartTotal + deliveryFee + tax;

  // Load customer addresses for checkout.
  useEffect(() => {
    async function loadAddresses() {
      try {
        // Fetch saved delivery addresses.
        // Load addresses from the backend instead of depending on old user data in memory.
        const data = await api<{
          success: boolean;
          addresses: Address[];
        }>("/addresses");

        // Keep one safe array value even if backend returns no saved addresses.
        const loadedAddresses = data.addresses || [];

        setAddresses(loadedAddresses);

        // Prefer default address, otherwise use first saved address.
        const defaultAddress =
          loadedAddresses.find((savedAddress) => savedAddress.isDefault) ||
          loadedAddresses[0];

        if (defaultAddress) {
          setAddress(defaultAddress);
        }
      } catch (error) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load addresses. Please try again.";

        toast.error(message);
      } finally {
        setAddressesLoading(false);
      }
    }

    loadAddresses();
  }, []);

  // Convert checkout data into a backend order.
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      if (!address) {
        throw new Error("Please select a delivery address.");
      }

      // Send order creation request to backend.
      // Backend creates the order and decides whether payment needs Stripe Checkout.
      const data = await api<{
        success: boolean;
        order?: {
          _id: string;
        };
        orderId?: string;
        checkoutUrl?: string | null;
      }>("/orders", {
        method: "POST",
        body: {
          // Send only essential order data to backend.
          // Send product IDs and quantities only; backend reads trusted product prices itself.
          items: items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          })),

          shippingAddress: address,
          paymentMethod,
        },
      });

      // Card payment returns Stripe's hosted Checkout URL.
      if (data.checkoutUrl) {
        // Leave this app temporarily and let Stripe collect the card payment securely.
        window.location.href = data.checkoutUrl;
        return;
      }

      // Order completed successfully.
      // Non-card order is complete here, so remove purchased items from local cart state.
      clearCart();

      // Redirect customer to order history.
      if (!data.order?._id) {
        throw new Error(
          "Order was created but no checkout destination was returned.",
        );
      }

      router.push(`/orders/${data.order._id}`);
      toast.success("Order placed successfully");
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to place your order. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    cartTotal,
    addresses,
    address,
    setAddress,
    addressesLoading,
    step,
    setStep,
    paymentMethod,
    setPaymentMethod,
    loading,
    deliveryFee,
    tax,
    total,
    handlePlaceOrder,
  };
}
