import { serve } from "inngest/next";

// Central Inngest client used by all background workflows.
import { inngest } from "@/inngest/client";

// Import all workflows that should be available to Inngest.
import { lowStockAlert } from "@/inngest/functions/lowStockAlert";
import { sendMonthlyOffers } from "@/inngest/functions/sendMonthlyOffers";
import { autoAssignRider } from "@/inngest/functions/autoAssignRider";

// API Flow:
// Event / Cron Trigger → Inngest Receives Request → Match Registered Workflow → Execute Background Function → Return Workflow Result

// Creates the Inngest API endpoint.
// This becomes the single entry point for all events, cron jobs and background workflows.
export const { GET, POST, PUT } = serve({
  client: inngest,

  // Register every workflow that should be available.
  functions: [autoAssignRider, lowStockAlert, sendMonthlyOffers],
});
