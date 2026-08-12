import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review, { HelpfulVote } from "@/models/Review";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/userAuth";
import "@/models/User";

export async function handleGetReviews(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    // Use .lean() to easily inject our custom properties below
    const reviews = await Review.find({ product: id })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .lean();

    let canReview = false;
    let userVotes: string[] = [];

    // Check user context silently (doesn't block guests)
    const user = await getAuthUser();

    if (user) {
      // Verify User Purchased & Received the Product
      const hasDeliveredOrder = await Order.findOne({
        user: user._id,
        "items.product": id,
        status: "Delivered",
      });
      canReview = !!hasDeliveredOrder;

      // Map which reviews this specific user found helpful
      const votes = await HelpfulVote.find({
        user: user._id,
        review: { $in: reviews.map((r) => r._id) },
      });
      userVotes = votes.map((v) => v.review.toString());
    }

    // Attach vote status to each review
    const reviewsWithVotes = reviews.map((r) => ({
      ...r,
      hasVoted: userVotes.includes(r._id.toString()),
    }));

    return NextResponse.json({
      success: true,
      reviews: reviewsWithVotes,
      canReview,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reviews"
      },
      { status: 500 },
    );
  }
}
