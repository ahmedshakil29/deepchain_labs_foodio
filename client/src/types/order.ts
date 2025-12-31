import { MenuItem } from "./menu";

export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export type OrderItem = {
  id: number;
  menuItemId: number;
  menuItem: MenuItem;
  priceAtOrder: number;
  quantity: number;
};

export type Order = {
  id: number;
  userId: number;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};
