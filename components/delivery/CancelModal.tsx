interface CancelModalProps {
  // Controls opening/closing of the modal from parent component
  setCancelModal: (cancelModal: string | null) => void;

  // Stores the reason entered by the delivery partner
  cancelReason: string;

  // Stores the reason entered by the delivery partner
  setCancelReason: (cancelReason: string) => void;

  // Final cancellation action (API call / state update)
  handleCancel: () => void;

  // Prevents multiple submissions while request is processing
  submitting: boolean;
}

export default function CancelModal({
  setCancelModal,
  cancelReason,
  setCancelReason,
  handleCancel,
  submitting,
}: CancelModalProps) {
  return (
    <>
      <div
        // Dark overlay behind the modal.
        // Clicking outside closes the modal.
        className="fixed inset-0 bg-black/40 z-50"
        onClick={() => setCancelModal(null)}
      />
      {/* Centered modal card shown above the overlay */}
      <div className="fixed inset-0 z-50 flex-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-in">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Cancel Delivery
          </h3>
          <p className="text-sm text-zinc-500 mb-4">
            Please provide a reason for cancellation.
          </p>
          <textarea
            // Controlled input: value comes from state and updates state on every change
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
            placeholder="Reason..."
            className="w-full px-4 py-3 text-sm rounded-xl border border-app-border focus:border-red-400 outline-none resize-none mb-4"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                // Close modal and clear old reason so next cancellation starts fresh
                setCancelModal(null);
                setCancelReason("");
              }}
              className="flex-1 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleCancel}
              // Disable button while cancellation request is running to avoid duplicate submissions
              disabled={submitting}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {
                submitting
                  ? "Cancelling..." // Feedback while request is in progress
                  : "Confirm Cancel" // Default action text
              }
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
