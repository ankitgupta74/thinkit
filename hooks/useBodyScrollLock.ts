import { useEffect } from "react";

// Lock background scrolling when modal/drawer is open.
function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    // "hidden" prevents page movement behind overlays.
    // Empty string restores browser default behavior.
    document.body.style.overflow = locked ? "hidden" : "";

    // Cleanup is important: avoid leaving body locked after unmount.
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
}

export default useBodyScrollLock;
