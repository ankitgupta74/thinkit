// Delivery partner authentication helper.

// Auth Flow:
//
// delivery-token Cookie
// → Verify JWT
// → Find Delivery Partner
// → Return Partner

// Used by every delivery partner API route.

import { cookies } from "next/headers";

import DeliveryPartner from "@/models/DeliveryPartner";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";

// Information stored inside the delivery token.
type JwtPayload = {
  id: string;
};

// Returns the currently authenticated delivery partner.
export async function getDeliveryPartner() {
  await connectDB();

  // Read cookies sent with the request.
  const cookieStore = await cookies();

  // Delivery partner login token.
  const token = cookieStore.get("delivery-token")?.value;

  // No token means no active rider session.
  if (!token) {
    return null;
  }

  try {
    // Decode token to identify the logged-in rider.
    const decoded = verifyToken(token) as JwtPayload;

    // Load rider information from the database.
    const partner = await DeliveryPartner.findById(decoded.id).lean();

    // Return authenticated delivery partner.
    return partner;
  } catch {
    // Invalid or expired token.
    return null;
  }
}
