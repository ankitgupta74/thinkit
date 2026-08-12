import mongoose from "mongoose";
import Review from "@/models/Review";
import Product from "@/models/Product";

export async function updateProductStats(productId: string) {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        rating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].rating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { rating: 0, reviewCount: 0 });
  }
}
