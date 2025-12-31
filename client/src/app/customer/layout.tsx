"use client";

import { useRouter } from "next/navigation";
import CustomerHeader from "@/app/(components)/customer/CustomerHeader";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();

  // Wait until auth info is ready
  const isReady = isAuthenticated !== undefined && role !== undefined;

  useEffect(() => {
    if (isReady) {
      const roleStr = String(role).toLowerCase();
      if (!isAuthenticated || roleStr !== "user") {
        router.replace("/auth");
      }
    }
  }, [isReady, isAuthenticated, role, router]);

  // FIX: Always return the same Layout structure ("min-h-screen") to match the Server.
  // Even if not ready, we render the Layout and put the loader INSIDE the <main>.
  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]">
        {/* We render the Header here so the HTML matches the Server's HTML */}
        <CustomerHeader />

        <main className="max-w-[1440px] mx-auto px-8 py-6">
          {/* Loading spinner moved inside the main area, not replacing the whole tree */}
          <div className="flex h-[calc(100vh-200px)] items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <CustomerHeader />
      <main>{children}</main>
      {/* <main className="max-w-[1440px] mx-auto px-8 py-6">{children}</main> */}
    </div>
  );
}
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import CustomerHeader from "@/app/(components)/customer/CustomerHeader";
// import { useAuth } from "@/hooks/useAuth";

// export default function UserLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const { isAuthenticated, role } = useAuth();

//   // Wait until auth info is ready
//   const isReady = isAuthenticated !== undefined && role !== undefined;

//   useEffect(() => {
//     if (isReady) {
//       const roleStr = String(role).toLowerCase();
//       if (!isAuthenticated || roleStr !== "user") {
//         router.replace("/auth");
//       }
//     }
//   }, [isReady, isAuthenticated, role, router]);

//   if (!isReady) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <p className="text-gray-500">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#FAFAF8]">
//       {/* Top Navigation */}
//       <CustomerHeader />

//       {/* Page Content */}
//       <main className="max-w-[1440px] mx-auto px-8 py-6">{children}</main>
//     </div>
//   );
// }
// 3rd one ____________________________________
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import CustomerHeader from "@/app/(components)/customer/CustomerHeader";
// import { useAuth } from "@/hooks/useAuth";

// export default function UserLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const { user, isAuthenticated, role } = useAuth();

//   useEffect(() => {
//     if (!isAuthenticated || role?.toLowerCase() !== "user") {
//       // redirect to login if not authenticated or wrong role
//       router.replace("/auth");
//     }
//   }, [isAuthenticated, role, router]);

//   if (!isAuthenticated || role?.toLowerCase() !== "user") {
//     return null; // or a <Loader /> spinner while redirecting
//   }

//   return (
//     <div className="min-h-screen bg-[#FAFAF8]">
//       {/* Top Navigation */}
//       <CustomerHeader />

//       {/* Page Content */}
//       <main className="max-w-[1440px] mx-auto px-8 py-6">{children}</main>
//     </div>
//   );
// }
