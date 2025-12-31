import { useEffect, useState } from "react";
import { getCategories } from "@/services/category.service";

export function useCategories(isOpen: boolean) {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    getCategories()
      .then(setCategories)
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoading(false));
  }, [isOpen]);

  return { categories, loading, error };
}
