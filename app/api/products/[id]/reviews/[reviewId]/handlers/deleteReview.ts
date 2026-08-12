import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import { getAuthUser } from "@/lib/userAuth";
import { updateProductStats } from "@/utils/updateProductStats";

export async function handleDeleteReview(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized"
        },
        { status: 401 },
      );

    const { id, reviewId } = await params;
    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: user._id,
    });

    if (!review)
      return NextResponse.json(
        {
          success: false,
          message: "Review not found or unauthorized"
        },
        { status: 404 },
      );

    await updateProductStats(id);
    return NextResponse.json({
      success: true,
      message: "Review deleted"
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete review"
      },
      { status: 500 },
    );
  }
}
