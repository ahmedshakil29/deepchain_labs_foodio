"use client";

import { useMemo } from "react";
import { User } from "@/types/user";
import { getUser, isAuthenticated, logout as logoutFn } from "@/utils/auth";

export const useAuth = () => {
  const user: User | null = useMemo(() => getUser(), []);

  return {
    user,
    isAuthenticated: isAuthenticated(),
    role: user?.role,
    logout: logoutFn,
  };
};

// "use client";

// import { useMemo } from "react";
// import { getUserFromToken, logout as logoutFn } from "@/services/auth.service";

// export const useAuth = () => {
//   const user = useMemo(() => getUserFromToken(), []);

//   return {
//     user,
//     isAuthenticated: !!user,
//     role: user?.role,
//     logout: logoutFn,
//   };
// };

// "use client";

// import { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";

// type User = {
//   id: number;
//   name: string;
//   email: string;
//   role: "user" | "admin";
// };

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     // Wrap in micro-task to avoid "setState in effect" warning
//     const decodeToken = async () => {
//       try {
//         const decoded = jwtDecode<User>(token);
//         setUser(decoded);
//       } catch (err) {
//         console.error("Invalid token");
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     decodeToken();
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return { user, isAuthenticated: !!user, loading, logout };
// };
