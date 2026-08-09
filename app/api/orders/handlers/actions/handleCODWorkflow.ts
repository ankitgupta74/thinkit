import Product from "@/models/Product";
import { inngest } from "@/inngest/client";

// COD path:
// No online payment confirmation is needed, so reserve stock immediately.

export async function handleCODWorkflow(order: {
  _id: string | { toString: () => string };
  items: { product: string; quantity: number }[];
}) {
  // Reduce inventory after successful order creation
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: -item.quantity,
      },
    });

    // Notify inventory workflows about stock changes.
    await inngest.send({
      name: "inventory/stock.updated",
      data: {
        productId: item.product,
      },
    });
  }

  // Start post-order automation workflows.
  // COD order is now ready for the normal delivery workflow, including rider assignment.
  await inngest.send({
    name: "order/placed",
    data: {
      orderId: order._id.toString(),
    },
  });
}
