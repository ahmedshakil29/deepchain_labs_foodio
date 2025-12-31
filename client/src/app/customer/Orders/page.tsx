"use client";

import { useState, useEffect } from "react";
import OrderPlaceCart from "@/app/(components)/orders/OrderPlaceCart";
import axios from "axios";
import { getAuthToken } from "@/utils/auth";

type Order = {
  orderId: string;
  placedDate: string;
  placedTime: string;
  items: Array<{
    quantity: number;
    name: string;
    price: number;
  }>;
  deliveryAddress: string;
  totalAmount: number;
  status: "PENDING" | "PREPARING" | "READY" | "COMPLETED";
};
type OrderResponse = {
  id: string;
  createdAt: string;
  orderItems?: Array<{
    quantity: number;
    price: string;
    menuItem?: { name: string };
  }>;
  totalPrice: string;
  status: "PENDING" | "PREPARING" | "READY" | "COMPLETED";
  user?: { address: string };
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = getAuthToken();

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get("http://localhost:3001/user/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Backend data কে frontend format এ convert
        // const formattedOrders: Order[] = (response.data as OrderResponse[]).map((order) => { ... });
        const formattedOrders: Order[] = response.data.map((order: any) => {
          // Date formatting
          const orderDate = new Date(order.createdAt);
          const placedDate = orderDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
          const placedTime = orderDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          // Items mapping
          //   const items = order.orderItems.map((item: any) => ({
          //     quantity: item.quantity,
          //     name: item.menuItem.name,
          //     price: parseFloat(item.price),
          //   }));
          // Items mapping with fallback
          const items = (order.orderItems || []).map((item: any) => ({
            quantity: item.quantity,
            name: item.menuItem?.name || "Unknown Item",
            price: parseFloat(item.price || 0),
          }));

          return {
            orderId: order.id.toString(),
            placedDate,
            placedTime,
            items,
            deliveryAddress: order.user.address,
            totalAmount: parseFloat(order.totalPrice),
            status: order.status,
          };
        });

        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    filterStatus === "ALL"
      ? orders
      : orders.filter((order) => order.status === filterStatus);
  const handleViewMenu = () => {
    window.location.href = "/customer/FoodMenu";
  };
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-[#1A1A1A] mb-2">
            My Orders
          </h1>
          <p className="text-[16px] text-[#666666]">
            Track and manage your orders
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {["ALL", "PENDING", "PREPARING", "READY", "COMPLETED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all ${
                  filterStatus === status
                    ? "bg-[#1A3C34] text-white"
                    : "bg-[#F8F8F8] text-[#666666] hover:bg-[#E8E8E8]"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderPlaceCart
                key={order.orderId}
                orderId={order.orderId}
                placedDate={order.placedDate}
                placedTime={order.placedTime}
                items={order.items}
                deliveryAddress={order.deliveryAddress}
                totalAmount={order.totalAmount}
                status={order.status}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-[18px] text-[#666666]">
                No orders found with status: {filterStatus}
              </p>
            </div>
          )}
        </div>

        {/* Empty State (when no orders at all) */}
        {orders.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-[24px] font-semibold text-[#1A1A1A] mb-2">
              No orders yet
            </h3>
            <p className="text-[16px] text-[#666666] mb-6">
              Start ordering to see your order history here
            </p>
            <button
              className="px-6 py-3 bg-[#1A3C34] text-white rounded-lg hover:bg-[#2A4C44] transition-colors"
              onClick={handleViewMenu}
            >
              Browse Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
