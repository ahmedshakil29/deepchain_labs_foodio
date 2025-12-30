"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomerHeader from "@/app/(components)/customer/CustomerHeader";
import { useAuth } from "@/hooks/useAuth";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || role?.toLowerCase() !== "user") {
      // redirect to login if not authenticated or wrong role
      router.replace("/auth");
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role?.toLowerCase() !== "user") {
    return null; // or a <Loader /> spinner while redirecting
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Top Navigation */}
      <CustomerHeader />

      {/* Page Content */}
      <main className="max-w-[1440px] mx-auto px-8 py-6">{children}</main>
    </div>
  );
}
