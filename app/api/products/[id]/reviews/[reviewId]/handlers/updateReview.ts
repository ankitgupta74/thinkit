import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import { getAuthUser } from "@/lib/userAuth";
import { updateProductStats } from "@/utils/updateProductStats";

export async function handleUpdateReview(
  request: NextRequest,
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
    const { rating, comment } = await request.json();

    const review = await Review.findOneAndUpdate(
      { _id: reviewId, user: user._id },
      { rating: Number(rating), comment, isEdited: true },
      { new: true },
    ).populate("user", "name avatar");

    if (!review)
      return NextResponse.json(
        {
          success: false,
          message: "Review not found or unauthorized"
        },
        { status: 404 },
      );

    await updateProductStats(id);
    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update review"
      },
      { status: 500 },
    );
  }
}
