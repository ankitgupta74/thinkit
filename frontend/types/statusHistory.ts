import { ORDER_STATUSES } from "@/lib/orderStatus";

export interface StatusHistory {
  _id: string;

  status: (typeof ORDER_STATUSES)[number];
  timestamp: string;
  note: string;
}
