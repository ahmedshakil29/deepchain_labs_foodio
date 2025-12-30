import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, isAuthenticated: !!user, loading, logout };
};
