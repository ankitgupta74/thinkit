import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/userAuth";
import { connectDB } from "@/lib/mongodb";
import { handleStripeCheckout } from "./actions/handleStripeCheckout";
import { handleCODWorkflow } from "./actions/handleCODWorkflow";

// Snapshot of product details stored inside an order
// This keeps order history unchanged even if product data changes later
type OrderItem = {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
};

// Order Creation Flow:
//
// Customer Checkout
// → Validate Products
// → Verify Stock
// → Create Order
// → COD: Reduce Inventory + Start Delivery Workflow
// → Card: Create Stripe Checkout Session
// → Stripe Webhook Confirms Payment
// → Reduce Inventory + Start Delivery Workflow

export async function handleCreateOrder(request: NextRequest) {
  try {
    // Database access is needed for product checks and order creation
    await connectDB();

    // Only logged-in users can place orders
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // Read checkout information sent from the frontend
    const { items, shippingAddress, paymentMethod } = await request.json();

    // Only support the checkout methods currently implemented by this project.
    // Accept only payment methods that this checkout flow knows how to handle.
    if (!["cod", "card"].includes(paymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment method",
        },
        {
          status: 400,
        },
      );
    }

    // Prevent creating empty orders
    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No order items",
        },
        {
          status: 400,
        },
      );
    }

    // Collect product ids so all products can be fetched in one query
    const productIds = items.map((item: { product: string }) => item.product);

    // Always use product data from the database instead of trusting frontend values
    const products = await Product.find({
      _id: { $in: productIds },
    });

    // Create fast lookup by product id
    const productMap = new Map();

    products.forEach((product) => {
      productMap.set(product._id.toString(), product);
    });

    // Verify every requested item is still available
    // Check stock before creating either COD or card orders.
    // Card stock is reduced later only after Stripe confirms payment.
    for (const item of items) {
      const product = productMap.get(item.product);

      // Stop checkout if stock is insufficient
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `${product?.name || "Product"} out of stock`,
          },
          {
            status: 400,
          },
        );
      }
    }

    // Copy trusted product information into the order
    const orderItems: OrderItem[] = items.map(
      (item: { product: string; quantity: number }) => {
        const dbProduct = productMap.get(item.product);

        // Safety check in case a product disappears during processing
        if (!dbProduct) {
          throw new Error(`Product ${item.product} not found`);
        }

        return {
          product: dbProduct._id.toString(),
          name: dbProduct.name,
          image: dbProduct.image,
          price: dbProduct.price,
          quantity: item.quantity,
          unit: dbProduct.unit,
        };
      },
    );

    // Calculate totals from trusted database prices, not frontend values.
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Delivery is free once the cart crosses the minimum order value.
    const deliveryFee = subtotal > 149 ? 0 : 49;

    // Keep tax calculation on the server so the final amount cannot be changed by the client.
    const tax = Math.round(subtotal * 0.08 * 100) / 100;

    // Final amount customer needs to pay
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

    // Card orders stay pending until Stripe confirms payment through the webhook.
    // This flag decides which order path runs next: immediate COD or Stripe card checkout.
    const isCardPayment = paymentMethod === "card";

    // Create the order and save a snapshot of checkout data
    // Save the order first so both payment paths have one permanent order record.
    // Card orders remain pending; COD orders can continue immediately.
    const order = await Order.create({
      user: user._id,

      items: orderItems,

      shippingAddress,

      paymentMethod,

      subtotal,

      deliveryFee,

      tax,

      total,

      // Card orders must not enter delivery workflow before payment succeeds.
      status: isCardPayment ? "Payment Pending" : "Placed",

      // COD is unpaid until delivery. Card payment is updated by Stripe webhook.
      // Both orders begin unpaid:
      // COD is paid at delivery, while card payment is confirmed by the Stripe webhook.
      isPaid: false,

      // Track how the order moves through its lifecycle
      statusHistory: [
        {
          status: isCardPayment ? "Payment Pending" : "Placed",
          note: isCardPayment
            ? "Waiting for card payment"
            : "Order placed successfully",
          timestamp: new Date(),
        },
      ],
    });

    // Create a Stripe Checkout page and wait for the webhook before reducing stock or assigning a rider.
    // Path 1: Card Payment (Stripe)
    if (isCardPayment) {
      const origin = request.headers.get("origin");

      if (!origin) {
        return NextResponse.json(
          {
            success: false,
            message: "Unable to determine checkout origin",
          },
          { status: 400 },
        );
      }

      // Stripe handler
      const checkoutUrl = await handleStripeCheckout(order, total, origin);

      return NextResponse.json({
        success: true,
        orderId: order._id.toString(),
        checkoutUrl,
      });
    }

    // Path 2: Cash on Delivery Workflow
    await handleCODWorkflow(order);

    // Return fully populated order data for immediate UI updates
    // COD checkout finishes here, so return complete order details for the success screen.
    const populatedOrder = await Order.findById(order._id)
      .populate("user")
      .populate("items.product");
    // Replace referenced ids with actual documents

    // Send completed order back to the frontend
    return NextResponse.json({
      success: true,
      order: populatedOrder,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
      },
      {
        status: 500,
      },
    );
  }
}
