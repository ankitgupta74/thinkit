import type { Dispatch, SetStateAction } from "react";
import { XIcon } from "lucide-react";

interface FormData {
  label: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

interface AddressFormProps {
  resetForm: () => void;

  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;

  form: FormData;

  setForm: Dispatch<SetStateAction<FormData>>;

  editingID: string | null;

  isSubmitting: boolean;
}

function AddressForm({
  resetForm,
  handleSubmit,
  form,
  setForm,
  editingID,
  isSubmitting,
}: AddressFormProps) {
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-50" />
      {/* Form Container */}
      <div
        onClick={() => {
          if (!isSubmitting) {
            resetForm();
          }
        }}
        className="fixed inset-0 z-50 flex-center p-4"
      >
        <form
          action=""
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 w-full max-w-lg animate-fade-in"
        >
          {/* Form Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-app-green">
              {editingID ? "Edit Address" : "Add New Address"}
            </h2>
            <button
              type="button"
              aria-label="Hide Form"
              onClick={resetForm}
              disabled={isSubmitting}
              className="p-2 hover:bg-app-cream rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XIcon className="size-5" />
            </button>
          </div>
          {/* Form Input Fields */}
          <div className="space-y-4">
            <div className="">
              <label
                htmlFor="label"
                className="block text-sm font-medium text-app-green mb-1.5"
              >
                Label
              </label>
              <input
                type="text"
                id="label"
                placeholder="Home, Work, etc."
                required
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
            </div>
            <div className="">
              <label
                htmlFor="street-address"
                className="block text-sm font-medium text-app-green mb-1.5"
              >
                Street Address
              </label>
              <input
                type="text"
                id="street-address"
                required
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-app-green mb-1.5"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-app-green mb-1.5"
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="">
                <label
                  htmlFor="zip"
                  className="block text-sm font-medium text-app-green mb-1.5"
                >
                  Zip Code
                </label>
                <input
                  type="text"
                  id="zip"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none"
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value })}
                />
              </div>
              <div className="flex items-end pb-1">
                <label
                  htmlFor="isDefault"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={form.isDefault}
                    onChange={(e) =>
                      setForm({ ...form, isDefault: e.target.checked })
                    }
                  />
                  <span className="text-sm text-app-text">Set as default</span>
                </label>
              </div>
            </div>
          </div>
          {/* Submit form */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full py-3 bg-app-green text-white font-semibold rounded-xl hover:bg-app-green-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? editingID
                ? "Saving Changes..."
                : "Saving..."
              : editingID
                ? "Update Address"
                : "Save Address"}
          </button>
        </form>
      </div>
    </>
  );
}

export default AddressForm;
