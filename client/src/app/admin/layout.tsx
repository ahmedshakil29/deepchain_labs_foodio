"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/app/(components)/admin/AdminSIdebar";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || role?.toLowerCase() !== "admin") {
      router.replace("/auth"); // redirect non-admin users
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role?.toLowerCase() !== "admin") {
    return null; // or <Loader /> if you want a spinner
  }

  return (
    <div className="flex h-screen bg-[#F5F5F0]">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
