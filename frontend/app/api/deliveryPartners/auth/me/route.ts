// Returns information about the currently logged-in delivery partner.

import { NextResponse } from "next/server";
import { getDeliveryPartner } from "@/lib/deliveryAuth";

// Used by the delivery dashboard to identify the current rider.
export async function GET() {
  try {
    // Read rider information from the authentication token.
    const partner = await getDeliveryPartner();

    // Rider must be logged in to access profile data.
    if (!partner) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // Create a safe copy before sending data to the frontend.
    const partnerData = {
      ...partner,
    };

    delete partnerData.password;

    // Return authenticated rider information.
    return NextResponse.json({
      success: true,
      partner: partnerData,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed",
      },
      {
        status: 500,
      },
    );
  }
}
