import { Inngest } from "inngest";

// Shared Inngest client used by all background workflows.
// Think of it as the central event hub of the application.
export const inngest = new Inngest({
  // Unique name used to identify this application's workflows.
  id: "thinkit",
});
