// Delivery Partner Flow:
//
// Load Partners
// → Create Partner
// → Activate / Deactivate
// → Assign To Orders

"use client";

import { useEffect, useState } from "react";
import { PlusIcon, XIcon, TruckIcon, PhoneIcon, MailIcon } from "lucide-react";
import { DeliveryPartner } from "@/types";
import Loader from "@/components/ui/Loader";

export default function AdminDeliveryPartners() {
  // Stores all delivery partners shown on the page
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);

  // Controls loading screen while data is being fetched
  const [loading, setLoading] = useState(true);

  // Controls opening and closing of the partner form modal
  const [showForm, setShowForm] = useState(false);

  // Prevents multiple form submissions while saving
  const [saving, setSaving] = useState(false);

  // Stores all form field values in a single object
  // This makes form management easier as the form grows
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    vehicleType: "bike",
  });

  useEffect(() => {
    // Load all delivery partners from backend.
    const fetchPartners = async () => {
      try {
        // Fetch latest partner list for admin dashboard.
        const response = await fetch("/api/deliveryPartners");

        const data = await response.json();

        if (data.success) {
          setPartners(data.partners);
        }
      } catch (error) {
        console.error(error);
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
      const response = await fetch("/api/deliveryPartners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      // Update UI immediately without reloading page.
      if (data.success) {
        setPartners((prev) => [data.partner, ...prev]);

        setForm({
          name: "",
          email: "",
          password: "",
          phone: "",
          vehicleType: "bike",
        });

        setShowForm(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Enable or disable a delivery partner.
  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      // Update partner active status in database.
      const response = await fetch(`/api/deliveryPartners/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !isActive,
        }),
      });

      const data = await response.json();

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
    }
  };

  // Show loader until partner data is available
  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Page title and primary action button */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">
          Delivery Partners
        </h1>
        <button
          type="button"
          // Open onboarding form modal
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-colors flex items-center gap-2"
        >
          <PlusIcon className="size-4" /> Add Partner
        </button>
      </div>

      {/* Partners Grid */}
      {/* Friendly message when no delivery partners exist */}
      {partners.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-app-border">
          <TruckIcon className="size-12 text-app-border mx-auto mb-3" />
          <p className="text-lg font-semibold text-zinc-900 mb-1">
            No delivery partners
          </p>
          <p className="text-sm text-zinc-500">
            Onboard your first partner to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Render one card for each delivery partner */}
          {partners.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl border border-app-border p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-app-green flex-center">
                    {/* Simple avatar using first letter of partner name */}
                    <span className="text-white font-semibold text-sm">
                      {p.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 text-sm">
                      {p.name}
                    </p>
                    <p className="text-xs text-zinc-500 capitalize">
                      {p.vehicleType}
                    </p>
                  </div>
                </div>
                {/* Badge color changes based on active status */}
                <span
                  className={`px-2.5 py-1 text-[10px] font-semibold rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="space-y-1.5 text-sm text-zinc-600">
                <p className="flex items-center gap-2">
                  <MailIcon className="w-3.5 h-3.5 text-zinc-400" /> {p.email}
                </p>
                <p className="flex items-center gap-2">
                  <PhoneIcon className="w-3.5 h-3.5 text-zinc-400" /> {p.phone}
                </p>
              </div>
              <button
                type="button"
                // Pass current status so it can be switched to the opposite state later
                onClick={() => toggleActive(p._id, p.isActive ?? false)}
                className={`w-full py-2 text-xs font-medium rounded-lg transition-colors ${p.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
              >
                {p.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Partner Modal */}
      {/* Show onboarding form only when requested */}
      {showForm && (
        <>
          <div
            // Clicking outside closes the modal
            className="fixed inset-0 bg-app-cream/80 backdrop-blur z-50"
            onClick={() => setShowForm(false)}
          />
          <div className="fixed inset-0 z-50 flex-center p-4">
            <form
              // Handles creation of a new delivery partner
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-6 w-full max-w-lg animate-fade-in"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-app-green">
                  Onboard Delivery Partner
                </h2>
                <button
                  type="button"
                  aria-label="Close modal"
                  // Close modal without saving
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-app-cream rounded-lg"
                >
                  <XIcon className="size-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-app-green mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    // Controlled input: value comes from state and updates state on change
                    value={form.name}
                    // Copy existing form values and update only the changed field
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-app-green mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-app-green mb-1.5"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      minLength={6}
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-app-green mb-1.5"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="text"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="vehicleType"
                      className="block text-sm font-medium text-app-green mb-1.5"
                    >
                      Vehicle Type
                    </label>
                    <select
                      // Dropdown for selecting delivery vehicle type
                      id="vehicleType"
                      value={form.vehicleType}
                      onChange={(e) =>
                        setForm({ ...form, vehicleType: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none bg-white"
                    >
                      <option value="bike">Bike</option>
                      <option value="scooter">Scooter</option>
                      <option value="car">Car</option>
                    </select>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                // Disable button while create request is running
                disabled={saving}
                className="mt-6 w-full py-3 bg-app-green text-white font-semibold rounded-xl hover:bg-app-green-light transition-colors disabled:opacity-60"
              >
                {
                  saving
                    ? "Creating..." // Show progress while saving
                    : "Create Partner" // Default button text
                }
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
