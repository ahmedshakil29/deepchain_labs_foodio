import api from "./api";
import { Order, OrderStatus } from "@/types/order";

export const getOrders = async (): Promise<Order[]> => {
  const res = await api.get("/admin/orders");
  return res.data;
};

export const getOrderDetails = async (id: number): Promise<Order> => {
  const res = await api.get(`/admin/order/${id}`);
  return res.data;
};

export const updateOrderStatus = async (id: number, status: OrderStatus) => {
  return api.patch(`/admin/order/status/${id}`, { status });
};
