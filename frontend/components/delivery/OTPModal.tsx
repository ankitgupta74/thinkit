interface OtpModalProps {
  // Controls opening and closing of the OTP modal
  setOtpModal: (otpModal: string | null) => void;

  // Current OTP entered by the user
  otp: string;

  // Updates OTP value while typing
  setOtp: (otp: string) => void;

  // Final delivery confirmation action
  handleComplete: () => void;

  // Tracks request state to prevent duplicate submissions
  submitting: boolean;
}

export default function OtpModal({
  setOtpModal,
  otp,
  setOtp,
  handleComplete,
  submitting,
}: OtpModalProps) {
  return (
    <>
      <div
        // Dark background behind the modal.
        // Clicking outside closes the modal.
        className="fixed inset-0 bg-black/40 z-50"
        onClick={() => setOtpModal(null)}
      />
      <div className="fixed inset-0 z-50 flex-center p-4">
        {/* Main OTP verification popup */}
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-in">
          <h3 className="text-lg font-semibold text-app-green mb-2">
            Enter Delivery OTP
          </h3>
          <p className="text-sm text-zinc-500 mb-5">
            Ask the customer for the 6-digit OTP shown on their tracking page.
          </p>
          {/* Large monospace digits make OTPs easier to read and verify */}
          <input
            type="text"
            maxLength={6}
            // Controlled input:cvalue comes from state and updates state on every change
            value={otp}
            // Allow only numbers and remove any letters/symbols
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] rounded-xl border border-app-border focus:border-app-green outline-none mb-4"
          />
          <div className="flex gap-2">
            <button
              type="button"
              // Close modal and clear previous OTP so next verification starts fresh
              onClick={() => {
                setOtpModal(null);
                setOtp("");
              }}
              className="flex-1 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleComplete}
              // Require exactly 6 digits before allowing verification
              // Also disable while request is processing
              disabled={otp.length !== 6 || submitting}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {
                submitting
                  ? "Verifying..." // Show progress while checking OTP
                  : "Confirm Delivery" // Default action text
              }
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
