import { ShoppingBagIcon } from "lucide-react";
export function CartEmptyState() {
  return (
    <div className="flex flex-1 min-h-60 flex-col items-center justify-center py-12 text-center">
      <ShoppingBagIcon className="size-16 text-app-border mb-4" />
      <h3 className="text-lg font-medium mb-1">Your cart is empty</h3>
    </div>
  );
}
