// Standard order lifecycle used throughout the application.
// Keeping statuses in one place avoids spelling mistakes and inconsistencies.
export const ORDER_STATUSES = [
  // Order received from customer.
  "Placed",

  // Store has accepted the order.
  "Confirmed",

  // Delivery partner has been assigned.
  "Assigned",

  // Products are packed and ready to leave.
  "Packed",

  // Order is currently on the way to the customer.
  "Out for Delivery",

  // Customer successfully received the order.
  "Delivered",

  // Order was cancelled before completion.
  "Cancelled",
] as const;
