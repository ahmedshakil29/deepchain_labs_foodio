"use client";

import { useAuth } from "@/hooks/useAuth";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({
  children,
  adminOnly = false,
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) router.push("/login");
      if (adminOnly && user?.role !== "admin") router.push("/");
    }
  }, [loading, isAuthenticated, user, adminOnly, router]);

  if (loading || !isAuthenticated) return <p>Loading...</p>;

  return <>{children}</>;
}
