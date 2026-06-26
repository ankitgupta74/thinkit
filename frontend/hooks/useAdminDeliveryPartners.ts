import { useEffect, useState } from "react";
import { DeliveryPartner, VehicleType } from "@/types";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

// Delivery Partner Flow:
//
// Load Partners
// → Create Partner
// → Activate / Deactivate
// → Assign To Orders

export function useAdminDeliveryPartners() {
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<DeliveryPartner | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    vehicleType: "bike" as VehicleType,
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    vehicleType: "bike" as VehicleType,
  });

  const openEditModal = (partner: DeliveryPartner) => {
    setEditingPartner(partner);

    setEditForm({
      name: partner.name,
      email: partner.email,
      password: "******",
      phone: partner.phone,
      vehicleType: partner.vehicleType ?? "bike",
    });

    setShowEditForm(true);
  };

  useEffect(() => {
    // Load all delivery partners from backend.
    const fetchPartners = async () => {
      try {
        // Fetch latest partner list for admin dashboard.
        const data = await api<{
          success: boolean;
          partners: DeliveryPartner[];
        }>("/deliveryPartners");

        setPartners(data.partners);
      } catch (error) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load partners. Please try again.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Create a new delivery partner account.
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Send onboarding form data to backend.
      const data = await api<{
        success: boolean;
        partner: DeliveryPartner;
      }>("/deliveryPartners", {
        method: "POST",
        body: form,
      });

      // Update UI immediately without reloading page.
      if (data.success) {
        setPartners((prev) => [data.partner, ...prev]);

        setForm({
          name: "",
          email: "",
          password: "",
          phone: "",
          vehicleType: "bike" as VehicleType,
        });

        setShowForm(false);
      }
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit your credentials. Please try again.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const updatePartner = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!editingPartner) return;

    try {
      setSaving(true);

      const data = await api<{
        success: boolean;
        partner: DeliveryPartner;
      }>(`/deliveryPartners/${editingPartner._id}`, {
        method: "PUT",
        body: editForm,
      });

      if (data.success) {
        setPartners((prev) =>
          prev.map((partner) =>
            partner._id === editingPartner._id ? data.partner : partner,
          ),
        );

        setShowEditForm(false);
        setEditingPartner(null);
        setEditForm({
          name: "",
          email: "",
          password: "",
          phone: "",
          vehicleType: "bike",
        });
      }
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to update your credentials. Please try again.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Enable or disable a delivery partner.
  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      // Update partner active status in database.
      const data = await api<{
        success: boolean;
        partner: DeliveryPartner;
      }>(`/deliveryPartners/${id}`, {
        method: "PUT",
        body: {
          isActive: !isActive,
        },
      });

      // Keep frontend state aligned with backend response.
      if (data.success) {
        setPartners((prev) =>
          prev.map((partner) =>
            partner._id === id
              ? {
                  ...partner,
                  isActive: !isActive,
                }
              : partner,
          ),
        );
      }
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to toggle. Please try again.";

      toast.error(message);
    }
  };

  return {
    partners,
    loading,
    showForm,
    setShowForm,
    showEditForm,
    setShowEditForm,
    editingPartner,
    setEditingPartner,
    saving,
    form,
    setForm,
    editForm,
    setEditForm,
    openEditModal,
    handleSubmit,
    updatePartner,
    toggleActive,
  };
}
