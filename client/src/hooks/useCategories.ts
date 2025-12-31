// src/hooks/useCategories.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthConfig } from "@/utils/auth";

export const useCategories = () => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:3001/admin/categories",
        getAuthConfig()
      );
      setCategories(res.data);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
};
