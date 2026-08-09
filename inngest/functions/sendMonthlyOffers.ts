import { connectDB } from "@/lib/mongodb";
import { inngest } from "../client";
import Product from "@/models/Product";
import User from "@/models/User";
import { sendEmail } from "@/lib/nodemailer";

// Business Goal:
// Bring customers back by regularly promoting products through email campaigns.

// Workflow Flow:
// Monthly Schedule → Fetch Deals → Fetch Users → Send Emails → Report Results

// Sends promotional emails to customers every month.
export const sendMonthlyOffers = inngest.createFunction(
  {
    id: "send-monthly-offers",
    name: "Send Monthly Offers",
    // Scheduled workflow that runs automatically.
    triggers: [
      {
        // Runs on the 1st day of every month at 10:00.
        cron: "0 10 1 * *",
      },
    ],
  },
  async ({ step }) => {
    console.log("MONTHLY OFFERS FUNCTION TRIGGERED");

    // Load promotional products and customer list.
    const { deals, users } = await step.run(
      "fetch-deals-and-users",
      async () => {
        // Required before reading products and users.
        await connectDB();

        // Select products that can be promoted in the email campaign.
        const deals = await Product.find({
          stock: { $gt: 0 },
        })
          // Higher discounts usually appear first.
          .sort({ originalPrice: -1 })
          // Keep the email short by selecting only a few offers.
          .limit(6);

        // Fetch customers who will receive the promotion.
        const users = await User.find(
          {},
          {
            name: 1,
            email: 1,
          },
        );

        return {
          deals,
          users,
        };
      },
    );

    console.log("Deals:", deals.length);
    console.log("Users:", users.length);

    // Nothing to send if there are no users or deals.
    if (users.length === 0 || deals.length === 0) {
      return {
        skipped: true,
        reason: "No users or deals",
      };
    }

    // Track how many emails were successfully processed.
    let sentCount = 0;

    // Send emails in smaller groups to reduce load.
    const batchSize = 10;

    // Process users in batches instead of all at once.
    for (let i = 0; i < users.length; i += batchSize) {
      // Current group of users being processed.
      const batch = users.slice(i, i + batchSize);

      // Each batch becomes its own workflow step.
      await step.run(`send-offers-batch-${i}`, async () => {
        console.log(`Processing Batch ${i}`);

        // Send the promotional email to each user in the batch.
        for (const u of batch) {
          // Deliver the monthly marketing email.
          await sendEmail({
            to: u.email,
            subject: "Fresh Picks Just For You!",
            body: `
              <h1>Monthly Offers</h1>
              <p>Hello ${u.name}</p>
              <p>This is a test monthly offers email.</p>
            `,
          });

          console.log("Email sent to:", u.email);
        }
      });
      // Keep track of completed email deliveries.
      sentCount += batch.length;
    }
    // Summary returned after the campaign finishes.
    return {
      success: true,
      sent: sentCount,
    };
  },
);
