import { inngest } from "../client";
import { connectDB } from "@/lib/mongodb";
import { sendEmail } from "@/lib/nodemailer";
import Product from "@/models/Product";

// Workflow Flow:
// Stock Updated → Event Triggered → Product Checked → Low Stock Detected → Admin Email Sent

// Background workflow that watches inventory levels and notifies admins when stock becomes low.
export const lowStockAlert = inngest.createFunction(
  {
    id: "low-stock-alert",
    name: "Low Stock Alert",
    // Run this workflow whenever product stock changes.
    triggers: [
      {
        // Fired after inventory quantity gets updated.
        event: "inventory/stock.updated",
      },
    ],
  },
  // Main workflow logic starts here after the event is received.
  async ({ event }) => {
    console.log("LOW STOCK EVENT RECEIVED");

    // Extract information sent with the event.
    const { productId } = event.data;
    console.log("Product ID:", productId);

    // We need database access to check the latest stock value.
    await connectDB();

    // Find the product whose stock was updated.
    const product = await Product.findById(productId);

    // Stop the workflow if the product no longer exists.
    if (!product) {
      console.log("PRODUCT NOT FOUND");
      return {
        success: false,
      };
    }

    console.log("PRODUCT FOUND:");
    console.log(product);

    // No alert needed if inventory is still at a safe level.
    if (product.stock > 10) {
      console.log("STOCK IS HEALTHY");
      return {
        success: true,
      };
    }

    console.log("LOW STOCK PRODUCT:");
    console.log(product.name);
    console.log("Current Stock:", product.stock);

    // Admins will receive the low stock notification email.
    const adminEmails = process.env.ADMIN_EMAILS;
    if (!adminEmails) {
      throw new Error("ADMIN_EMAILS not configured");
    }

    // Email content containing product information so admins know what needs restocking.
    const emailBody = `
      <h2>Low Stock Alert</h2>

      <p>
        Product <strong>${product.name}</strong>
        is running low on stock.
      </p>

      <ul>
        <li>Product ID: ${product._id}</li>
        <li>Current Stock: ${product.stock}</li>
        <li>Category: ${product.category}</li>
        <li>Price: ₹${product.price}</li>
      </ul>
    `;

    await sendEmail({
      to: adminEmails,
      subject: `Low Stock Alert - ${product.name}`,
      body: emailBody,
    });
    console.log("LOW STOCK EMAIL SENT");

    // Workflow completed successfully.
    return {
      success: true,
    };
  },
);
