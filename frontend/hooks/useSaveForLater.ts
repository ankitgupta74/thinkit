import {
  useCallback,
  useEffect,
  useState
} from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { SaveForLaterItem } from "@/types";
import { useAuth } from "@/context/auth/useAuth";

export function useSaveForLater() {
  const [saveForLater, setSaveForLater] = useState<SaveForLaterItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();

  // Load the current customer's Save For Later.
  const loadSaveForLater = useCallback(async () => {
    if (!user) {
      setSaveForLater([]);
      return;
    }
    const data = await api<{
      success: boolean;
      saveForLater: SaveForLaterItem[];
    }>("/saveForLater");

    setSaveForLater(data.saveForLater);
  }, [user]);

  const getProductId = (item: SaveForLaterItem) =>
    typeof item.product === "string" ? item.product : item.product._id;

  // Check whether a product already exists in the customer's Save For Later.
  const isInSaveForLater = (productId: string) => {
    return saveForLater.some((item) => {
      return getProductId(item) === productId;
    });
  };

  // Add a product to the customer's Save For Later.
  const addToSaveForLater = async (productId: string) => {
    try {
      const data = await api<{
        success: boolean;
        message: string;
        saveForLaterItem: SaveForLaterItem;
      }>("/saveForLater", {
        method: "POST",
        body: {
          productId,
        },
      });

      // Show newest item first.
      setSaveForLater((prev) => [data.saveForLaterItem, ...prev]);

      toast.success(data.message);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add item to Save For Later.",
      );
    }
  };

  // Remove a Save For Later item.
  const removeFromSaveForLater = async (saveForLaterItemId: string) => {
    try {
      const data = await api<{
        success: boolean;
        message: string;
      }>(`/saveForLater/${saveForLaterItemId}`, {
        method: "DELETE",
      });

      setSaveForLater((prev) =>
        prev.filter((item) => item._id !== saveForLaterItemId),
      );

      toast.success(data.message);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to remove Save For Later item.",
      );
    }
  };

  // Add or remove a product depending on its current Save For Later state.
  const toggleSaveForLater = async (productId: string) => {
    const saveForLaterItem = saveForLater.find((item) => {
      return getProductId(item) === productId;
    });

    if (saveForLaterItem) {
      await removeFromSaveForLater(saveForLaterItem._id);
    } else {
      await addToSaveForLater(productId);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }
    async function initializeSaveForLater() {
      try {
        if (!user) {
          setSaveForLater([]);
          setLoading(false);
          return;
        }
        await loadSaveForLater();
      } catch (error) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to initialize Save For Later.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    initializeSaveForLater();
  }, [user, authLoading, loadSaveForLater]);

  return {
    saveForLater,
    loading,

    loadSaveForLater,

    isInSaveForLater,

    addToSaveForLater,
    removeFromSaveForLater,
    toggleSaveForLater,
  };
}