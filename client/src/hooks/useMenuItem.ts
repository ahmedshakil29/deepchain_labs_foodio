// src/hooks/useMenuItem.ts
import axios from "axios";
import { useState } from "react";
import { getAuthConfig } from "@/utils/auth";

export const useCreateMenuItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createMenuItem = async (data: any) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");
      await axios.post("http://localhost:3001/admin/createmenuitem", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createMenuItem, loading, error };
};

export const useUpdateMenuItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateMenuItem = async (id: number, data: any) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");
      await axios.patch(
        `http://localhost:3001/admin/updatemenuitem/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateMenuItem, loading, error };
};
