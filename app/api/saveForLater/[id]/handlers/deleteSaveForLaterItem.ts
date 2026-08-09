import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/userAuth";
import SaveForLaterItem from "@/models/SaveForLaterItem";
import { NextRequest, NextResponse } from "next/server";

export async function handleDeleteSaveForLaterItem(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

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

    // Read the save for later item id from the URL
    const { id } = await params;

    const deletedSaveForLaterItem = await SaveForLaterItem.findOneAndDelete({
      _id: id,
      user: user._id,
    });
    if (!deletedSaveForLaterItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Item does not exist in your Save For Later.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item removed from Save For Later successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove Save For Later item",
      },
      {
        status: 500,
      },
    );
  }
}
