"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { getAuthConfig } from "@/utils/auth";

type OrderItem = {
  id: number;
  quantity: number;
  price: string;
  menuItem: {
    id: number;
    name: string;
    price: string;
  };
};

type OrderDetailsType = {
  id: number;
  userId: number;
  totalPrice: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    address: string;
  };
  orderItems: OrderItem[];
};

type OrderDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
};

export default function OrderDetailsModal({
  isOpen,
  onClose,
  orderId,
}: OrderDetailsModalProps) {
  const [orderDetails, setOrderDetails] = useState<OrderDetailsType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !isOpen) return;

      try {
        setIsLoading(true);
        setError("");

        const config = getAuthConfig();
        const response = await axios.get(
          `http://localhost:1/admin/order/${orderId}`,
          config
        );

        console.log("✅ Order details fetched:", response.data);
        setOrderDetails(response.data);
      } catch (err: any) {
        console.error("❌ Error fetching order details:", err);
        setError("Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="relative w-full max-w-[400px] rounded-[12px] bg-white p-[24px] shadow-2xl">
          {/* Header */}
          <div className="mb-[16px] flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-semibold text-[#1A1A1A]">
                Order Details
              </h2>
              {orderDetails && (
                <p className="text-[13px] text-[#7A7A7A] mt-[2px]">
                  #{orderDetails.id.toString().padStart(4, "0")}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-[#7A7A7A] transition hover:text-[#333333]"
            >
              <X size={20} />
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-12 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#1A3C34] border-r-transparent"></div>
              <p className="mt-2 text-[13px] text-[#7A7A7A]">Loading...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-[6px] bg-red-50 p-[12px] text-[13px] text-red-600">
              {error}
            </div>
          )}

          {/* Order Details Content */}
          {!isLoading && !error && orderDetails && (
            <div className="space-y-[16px]">
              {/* Address */}
              <div>
                <p className="text-[13px] font-medium text-[#333333] mb-[4px]">
                  Address
                </p>
                <p className="text-[13px] text-[#7A7A7A]">
                  {orderDetails.user.address}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-[#E6E2D8]"></div>

              {/* Items */}
              <div>
                <p className="text-[13px] font-medium text-[#333333] mb-[8px]">
                  Items
                </p>
                <div className="space-y-[6px]">
                  {orderDetails.orderItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-[13px]"
                    >
                      <span className="text-[#333333]">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span className="text-[#333333]">৳{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#E6E2D8]"></div>

              {/* Total */}
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-semibold text-[#1A1A1A]">
                  Total
                </p>
                <p className="text-[14px] font-semibold text-[#1A1A1A]">
                  ৳{orderDetails.totalPrice}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
