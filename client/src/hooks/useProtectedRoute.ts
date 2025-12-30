import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/utils/token";

export const useProtectedRoute = (role?: "ADMIN" | "USER") => {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user) router.replace("/auth");
    if (role && user.role !== role) router.replace("/auth");
  }, []);
};
