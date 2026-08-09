import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/userAuth";
import SaveForLaterItem from "@/models/SaveForLaterItem";
import "@/models/Product";
import { NextResponse } from "next/server";

// Returns all save for later items belonging to the current customer.
export async function handleGetAllSaveForLaterItems() {
  try {
    // DB connection
    await connectDB();

    // Save For Later items are private and belong to a specific user.
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please Sign In and try again.",
        },
        {
          status: 401,
        },
      );
    }

    // Load only save for later items owned by the current user.
    const saveForLater = await SaveForLaterItem.find({
      user: user._id,
    }) // Replace product id with actual product details
      .populate({
        path: "product",
      })
      // Show newest save for later items first
      .sort({
        createdAt: -1,
      });

    // Return customer's save for later.
    return NextResponse.json({
      success: true,
      saveForLater,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch Save For Later",
      },
      {
        status: 500,
      },
    );
  }
}
