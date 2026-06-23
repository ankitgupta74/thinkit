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

import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import Stripe from "stripe";
import "@/models/DeliveryPartner";
import "@/models/Product";
import "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";

// Server-only Stripe client used to create Checkout Sessions.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  try {
    // Connect before reading user orders
    await connectDB();

    // Orders are private, so the user must be logged in
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

    // Fetch only orders that belong to the logged-in customer.
    const orders = await Order.find({
      user: user._id,
    })
      .populate("deliveryPartner") // Replace delivery partner id with actual partner details
      .sort({
        createdAt: -1, // Show newest orders first
      });

    // Send user's order history to the frontend
    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
      },
      {
        status: 500,
      },
    );
  }
}

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

export async function POST(request: NextRequest) {
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

    // Redirect card customers to Stripe-hosted Checkout.
    // Card path:
    // Create a Stripe Checkout page and wait for the webhook before reducing stock or assigning a rider.
    if (isCardPayment) {
      const origin = request.headers.get("origin");

      // Stripe needs an absolute URL for redirect destinations.
      if (!origin) {
        return NextResponse.json(
          {
            success: false,
            message: "Unable to determine checkout origin",
          },
          {
            status: 400,
          },
        );
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: ["card"],

        // Grocery orders should not remain pending for an entire day.
        // Close unfinished Checkout sessions after 30 minutes.
        // The webhook changes the pending order to Cancelled when this happens.
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,

        // Return customer to their order after successful Stripe payment.
        // This redirect improves customer experience only.
        // The Stripe webhook, not this page, marks the payment as successful.
        success_url: `${origin}/orders/${order._id}?payment=success`,

        // Return customer to checkout without marking the order paid.
        // Customer can return to checkout without treating the order as paid.
        cancel_url: `${origin}/checkout?payment=cancelled`,

        // Stripe metadata lets the webhook find the exact MongoDB order.
        metadata: {
          orderId: order._id.toString(),
        },

        line_items: [
          {
            price_data: {
              currency: "inr",

              product_data: {
                name: "ThinkIt Grocery Order",
              },

              // Stripe uses paise, so ₹200.20 becomes 20020.
              unit_amount: Math.round(total * 100),
            },

            quantity: 1,
          },
        ],
      });

      // Store the Stripe session ID for audit, debugging, and payment lookup.
      order.stripeCheckoutSessionId = session.id;
      await order.save();

      // Stripe returns a hosted URL where the customer completes payment.
      // Frontend uses this URL to redirect the customer to Stripe Checkout.
      return NextResponse.json({
        success: true,
        orderId: order._id.toString(),
        checkoutUrl: session.url,
      });
    }

    // Reduce inventory after successful order creation
    // COD path:
    // No online payment confirmation is needed, so reserve stock immediately.
    for (const item of orderItems) {
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
