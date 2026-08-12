import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review, { HelpfulVote } from "@/models/Review";
import { getAuthUser } from "@/lib/userAuth";

export async function handleToggleHelpful(
  _request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json(
        { success: false, message: "Log in to vote" },
        { status: 401 },
      );

    const { reviewId } = await params;

    // Check if the user already voted on this specific review
    const existingVote = await HelpfulVote.findOne({
      review: reviewId,
      user: user._id,
    });

    if (existingVote) {
      // Remove vote
      await HelpfulVote.findByIdAndDelete(existingVote._id);
      await Review.findByIdAndUpdate(reviewId, { $inc: { helpfulCount: -1 } });
      return NextResponse.json({
        success: true,
        message: "Vote removed",
        voted: false,
      });
    } else {
      // Add vote
      await HelpfulVote.create({ review: reviewId, user: user._id });
      await Review.findByIdAndUpdate(reviewId, { $inc: { helpfulCount: 1 } });
      return NextResponse.json({
        success: true,
        message: "Vote added",
        voted: true,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process vote"
      },
      { status: 500 },
    );
  }
}
