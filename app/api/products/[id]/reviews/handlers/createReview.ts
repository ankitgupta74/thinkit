import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/userAuth";
import { updateProductStats } from "@/utils/updateProductStats";

export async function handleCreateReview(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    const { id } = await params;
    const { rating, comment } = await request.json();

    // Verify User Purchased & Received the Product
    const hasDeliveredOrder = await Order.findOne({
      user: user._id,
      "items.product": id,
      status: "Delivered",
    });

    if (!hasDeliveredOrder) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You can only review products that have been delivered to you.",
        },
        { status: 403 },
      );
    }

    // Prevent duplicate reviews
    const existingReview = await Review.findOne({
      product: id,
      user: user._id,
    });
    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          message: "Review already exists."
        },
        { status: 400 },
      );
    }

    // Create Review
    const review = await Review.create({
      product: id,
      user: user._id,
      rating: Number(rating),
      comment,
      isVerifiedPurchase: true,
    });

    await updateProductStats(id);
    await review.populate("user", "name avatar");

    return NextResponse.json({
      success: true,
      review
    }, {
      status: 201
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create review"
      },
      { status: 500 },
    );
  }
}
