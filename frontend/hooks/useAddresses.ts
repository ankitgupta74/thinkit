// Address Flow:
//
// Load Addresses
// → Create / Edit / Delete
// → Refresh List
// → Keep UI In Sync With Database

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Address } from "@/types";
import toast from "react-hot-toast";

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, seteditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });

  // Return form back to create mode after save or cancel.
  const resetForm = () => {
    setForm({
      label: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      isDefault: false,
    });
    setShowForm(false);
    seteditingId(null);
  };

  // Load saved addresses belonging to the logged-in user.
  const loadAddresses = async () => {
    // Shared helper requests the current user's saved addresses from the backend.
    const data = await api<{
      success: boolean;
      addresses: Address[];
    }>("/addresses");

    setAddresses(data.addresses);
  };

  // Gets the user's current device coordinates for the delivery address.
  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      // Browser asks for location permission, then returns the device coordinates.
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(error.message || "Unable to get your location."));
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 60000,
        },
      );
    });
  };

  // Handles both create and update address operations.
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    // Stops duplicate clicks while location and API requests are running.
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get fresh coordinates before saving, so this address can later be used for delivery tracking.
      const coordinates = await getLocation();

      // Combine typed address form values with the location data required by the backend.
      const payload = {
        ...form,
        ...coordinates,
      };

      // Same form supports both actions: ID means update; no ID means create.
      if (editingId) {
        await api<{
          success: boolean;
          address: Address;
        }>(`/addresses/${editingId}`, {
          method: "PUT",
          body: payload,
        });
        toast.success("Address Updated");
      } else {
        await api<{
          success: boolean;
          address: Address;
        }>("/addresses", {
          method: "POST",
          body: payload,
        });
        toast.success("Address Uploaded");
      }

      // Reload from database so the visible list matches the saved backend data.
      await loadAddresses();
      resetForm();
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit address. Please try again.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Populate form with existing address data for editing.
  const onEditHandler = (add: Address) => {
    setForm({
      label: add.label,
      address: add.address,
      city: add.city,
      state: add.state,
      zip: add.zip,
      isDefault: add.isDefault,
    });
    seteditingId(add._id);
    setShowForm(true);
  };

  // Remove address and refresh list.
  const onDeleteHandler = async (id: string) => {
    try {
      // Delete one address by its ID; backend also checks that it belongs to this user.
      await api<{
        success: boolean;
      }>(`/addresses/${id}`, {
        method: "DELETE",
      });

      await loadAddresses();
      toast.success("Address removed");
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete address. Please try again.";

      toast.error(message);
    }
  };

  useEffect(() => {
    // Initial page load.
    async function initializeAddresses() {
      try {
        await loadAddresses();
      } catch (error) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to initialize addresses. Please try again.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    initializeAddresses();
  }, []);

  return {
    addresses,
    loading,
    showForm,
    setShowForm,
    isSubmitting,
    editingId,
    form,
    setForm,
    resetForm,
    handleSubmit,
    onEditHandler,
    onDeleteHandler,
  };
}
