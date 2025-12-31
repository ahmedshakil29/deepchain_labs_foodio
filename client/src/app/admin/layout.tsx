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
  const { isAuthenticated, role } = useAuth();

  // Compute if auth info is ready
  const isReady = isAuthenticated !== undefined && role !== undefined;

  useEffect(() => {
    if (isReady) {
      // Convert role to string safely
      const roleStr = String(role).toLowerCase();
      if (!isAuthenticated || roleStr !== "admin") {
        router.replace("/auth");
      }
    }
  }, [isReady, isAuthenticated, role, router]);

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F5F0]">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import AdminSidebar from "@/app/(components)/admin/AdminSIdebar";
// import { useAuth } from "@/hooks/useAuth";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const { user, isAuthenticated, role } = useAuth();

//   useEffect(() => {
//     if (!isAuthenticated || role?.toLowerCase() !== "admin") {
//       router.replace("/auth"); // redirect non-admin users
//     }
//   }, [isAuthenticated, role, router]);

//   if (!isAuthenticated || role?.toLowerCase() !== "admin") {
//     return null; // or <Loader /> if you want a spinner
//   }

//   return (
//     <div className="flex h-screen bg-[#F5F5F0]">
//       <AdminSidebar />
//       <div className="flex-1 overflow-auto">{children}</div>
//     </div>
//   );
// }
