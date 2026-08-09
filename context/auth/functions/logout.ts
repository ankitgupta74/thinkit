import { api } from "@/lib/api";
import { User } from "@/types";
import toast from "react-hot-toast";


// Clear server session and refresh local auth state.
export const logout = async (
  setUser: (user: User | null) => void,
  setLoading: (loading: boolean) => void,
) => {
  try {
    // Ask backend to remove the customer authentication cookie.
    await api<{
      success: boolean;
    }>("/auth/logout", {
      method: "POST",
    });

    toast.success("Logged Out Successfully");
  } catch (error) {
    // Even if the server session is already gone, clear local auth state.
    console.error(error);
    toast.error("Error while logging out...")
  } finally {
    // Remove customer data immediately from the frontend session.
    setUser(null);
    setLoading(false);
  }
};
