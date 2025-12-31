"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getAuthConfig } from "@/utils/auth";
import Button from "@/app/(components)/commons/Button";
import OrderDetailsModal from "@/app/(components)/OrderDetailsModal";

type Order = {
  id: number;
  date: string;
  customer: string;
  total: string;
  status: "Pending" | "Preparing" | "Ready" | "Completed";
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>(""); // ✅ Success message state

  // Order details modal state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError("");

      const config = getAuthConfig();
      const response = await axios.get(
        "http://localhost:3001/admin/orders",
        config
      );

      // Transform backend data to match frontend structure
      const transformedOrders = response.data.map((order: any) => ({
        id: order.id,
        date: new Date(order.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        customer: order.user?.name || order.user?.email || "Unknown",
        total: `৳${order.totalPrice || 0}`,
        status:
          order.status.charAt(0).toUpperCase() +
          order.status.slice(1).toLowerCase(), // ✅ Capitalize first letter
      }));

      setOrders(transformedOrders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        setTimeout(() => router.push("/auth"), 1500);
      } else {
        setError("Failed to load orders");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "Preparing":
        return "bg-[#DBEAFE] text-[#1E40AF]";
      case "Ready":
        return "bg-[#D1FAE5] text-[#065F46]";
      case "Completed":
        return "bg-[#E5E7EB] text-[#374151]";
      default:
        return "bg-[#E5E7EB] text-[#374151]";
    }
  };

  // Handle status change
  const handleStatusChange = async (
    orderId: number,
    newStatus: Order["status"]
  ) => {
    try {
      setError("");
      setSuccessMessage("");

      const config = getAuthConfig();

      console.log("📤 Updating order status:", { orderId, newStatus });

      // Update status in backend
      await axios.patch(
        `http://localhost:3001/admin/order/status/${orderId}`,
        {
          status: newStatus.toUpperCase(), // Backend expects uppercase
        },
        config
      );

      console.log("✅ Status updated successfully");

      // ✅ Update local state immediately (optimistic update)
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // ✅ Show success message
      setSuccessMessage(`Order #${orderId} status updated to ${newStatus}`);

      // ✅ Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error: any) {
      console.error("❌ Error updating order status:", error);

      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else {
        setError("Failed to update status. Please try again.");
      }

      // ✅ Revert the change by refetching (in case of error)
      fetchOrders();
    }
  };

  // Handle details button click
  const handleDetailsClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <h1 className="text-[32px] font-semibold text-[#1A3C34] mb-8">
        Order Management
      </h1>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-green-700 font-medium">{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mb-4 text-center text-[#7A7A7A]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1A3C34] border-r-transparent"></div>
          <p className="mt-2">Loading...</p>
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && (
        <div className="bg-white rounded-lg border border-[#E6E2D8] overflow-hidden">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-[#7A7A7A]">
              No orders found.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E6E2D8] bg-[#F9FAFB]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#7A7A7A]">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#7A7A7A]">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#7A7A7A]">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#7A7A7A]">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#7A7A7A]">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#7A7A7A]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#E6E2D8] hover:bg-[#F9F9F9] transition"
                  >
                    <td className="py-4 px-4 text-sm text-[#1A3C34]">
                      #{order.id}
                    </td>
                    <td className="py-4 px-4 text-sm text-[#7A7A7A]">
                      {order.date}
                    </td>
                    <td className="py-4 px-4 text-sm text-[#7A7A7A]">
                      {order.customer}
                    </td>
                    <td className="py-4 px-4 text-sm text-[#1A3C34]">
                      {order.total}
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status} // ✅ This will now stay updated
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as Order["status"]
                          )
                        }
                        className={`px-3 py-1 text-xs font-medium rounded-full border cursor-pointer transition ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        text="Details"
                        onClick={() => handleDetailsClick(order.id)}
                        height=""
                        width="auto"
                        bgColor="#E6E2D8"
                        textColor="#1A1A1A"
                        className="px-4 py-1 text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrderId(null);
        }}
        orderId={selectedOrderId}
      />
    </div>
  );
}
