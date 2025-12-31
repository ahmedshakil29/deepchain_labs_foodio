"use client";

import { X } from "lucide-react";
import Button from "@/app/(components)/commons/Button";

type ShowLoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  redirectToAuth?: boolean; // optional: redirect automatically
};

export default function ShowLoginModal({
  isOpen,
  onClose,
  redirectToAuth = true,
}: ShowLoginModalProps) {
  if (!isOpen) return null;

  const handleLoginRedirect = () => {
    if (redirectToAuth) {
      window.location.href = "/auth";
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[20px] font-semibold text-[#1A1A1A]">
            Login Required
          </h2>
          <button
            onClick={onClose}
            className="text-[#999999] hover:text-[#1A1A1A] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Message */}
        <p className="text-[#666666] text-[14px] mb-6">
          You must be logged in to place an order. Please login to continue.
        </p>

        {/* Action */}
        <div className="flex justify-end">
          <Button
            text="Login"
            width="w-[120px]"
            height="h-[40px]"
            bgColor="#1A3C34"
            textColor="#fff"
            onClick={handleLoginRedirect}
            className="font-semibold"
          />
        </div>
      </div>
    </>
  );
}
