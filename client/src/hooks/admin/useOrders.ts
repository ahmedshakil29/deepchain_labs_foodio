import { useEffect, useState } from "react";
import { getOrders } from "@/services/order.service";
import { Order } from "@/types/order";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return { orders, loading };
}
