import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAdminUser } from "@/lib/adminAuth";
import DeliveryPartner from "@/models/DeliveryPartner";
import Order from "@/models/Order";
import { ACTIVE_DELIVERY_STATUSES } from "@/lib/orderStatus";

export async function handleGetPartners() {
  try {
    await connectDB();

    // Only admins should manage delivery partner accounts.
    const admin = await getAdminUser();

    if (!admin || !admin.isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        {
          status: 403,
        },
      );
    }

    // Show newest delivery partners first.
    const partners = await DeliveryPartner.find().sort({ createdAt: -1 });

    const partnersWithStatus = await Promise.all(
      partners.map(async (partner) => {
        const activeOrder = await Order.findOne({
          deliveryPartner: partner._id,
          status: {
            $in: ACTIVE_DELIVERY_STATUSES,
          },
        });

        const partnerData = partner.toObject();
        delete partnerData.password;

        return {
          ...partnerData,
          isBusy: Boolean(activeOrder),
          activeOrderId: activeOrder?._id ?? null,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      partners: partnersWithStatus,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 },
    );
  }
}
