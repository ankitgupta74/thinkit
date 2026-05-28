"use client";

import AddressCard from "@/components/address/AddressCard";
import AddressForm from "@/components/address/AddressForm";
import Loader from "@/components/ui/Loader";
import { dummyAddressData } from "@/public/assets";
import type { Address } from "@/types";
import { MapPinIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

function Address() {
  const [addresses, setAddresses] = useState<Address[]>(dummyAddressData);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, seteditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });

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

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (editingId) {
      setAddresses((prev) =>
        prev.map((add) =>
          add._id === editingId
            ? {
                ...add,
                ...form,
              }
            : add,
        ),
      );
    } else {
      const newAddress: Address = {
        _id: crypto.randomUUID(),
        ...form,
        lat: 0,
        lng: 0,
      };

      setAddresses((prev) => [newAddress, ...prev]);
    }

    resetForm();
  };

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

  const onDeleteHandler = (id: string) => {
    setAddresses((prev) => prev.filter((add) => add._id !== id));
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex  items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-app-green">
            My Addresses
          </h1>
          <button
            type="button"
            className="px-4 py-2 bg-app-green hover:bg-app-green-light text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <PlusIcon className="size-4" /> Add Address
          </button>
        </div>
        {/* Form Modal */}
        {showForm && (
          <AddressForm
            resetForm={resetForm}
            handleSubmit={handleSubmit}
            form={form}
            setForm={setForm}
            editingID={editingId}
          />
        )}
        {/* Address List */}
        {loading ? (
          <Loader />
        ) : addresses.length === 0 ? (
          <div className="text-center py-16">
            <MapPinIcon className="size-16 text-app-border mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-app-green mb-2">
              No Addresses Saved
            </h2>
            <p className="text-sm text-app-text-light">
              Add an address for faster checkout
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((add) => (
              <AddressCard
                key={add._id}
                address={add}
                onEditHandler={onEditHandler}
                onDeleteHandler={onDeleteHandler}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Address;
