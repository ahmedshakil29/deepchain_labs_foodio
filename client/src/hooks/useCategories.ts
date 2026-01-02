"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import { CategoryService } from "@/services/category.service";
import toast from "react-hot-toast";

type ItemLoadingState = {
  [key: number]: {
    deleting?: boolean;
    updating?: boolean;
  };
};

export function useCategories(autoFetch = true) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false); // list loading
  const [itemLoading, setItemLoading] = useState<ItemLoadingState>({}); // per-category loading

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Create a new category (global loading)
  const createCategory = async (name: string) => {
    try {
      setLoading(true);
      await CategoryService.create(name);
      toast.success("Category created");
      fetchCategories();
    } catch {
      toast.error("Category creation failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete a category (per-item loading)
  const deleteCategory = async (id: number) => {
    try {
      setItemLoading((prev) => ({ ...prev, [id]: { deleting: true } }));
      await CategoryService.delete(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Delete failed");
    } finally {
      setItemLoading((prev) => ({ ...prev, [id]: { deleting: false } }));
    }
  };

  // Optional: update a category (per-item loading)
  const updateCategory = async (id: number, name: string) => {
    try {
      setItemLoading((prev) => ({ ...prev, [id]: { updating: true } }));
      // await CategoryService.update(id, { name }); // Uncomment if update API exists
      toast.success("Category updated");
      fetchCategories();
    } catch {
      toast.error("Update failed");
    } finally {
      setItemLoading((prev) => ({ ...prev, [id]: { updating: false } }));
    }
  };

  useEffect(() => {
    if (autoFetch) fetchCategories();
  }, []);

  return {
    categories,
    loading, // list fetch/loading
    itemLoading, // per-category loading
    refetch: fetchCategories,
    createCategory,
    deleteCategory,
    updateCategory, // optional
  };
}

// // src/hooks/useCategories.ts
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { getAuthConfig } from "@/utils/auth";

// export const useCategories = () => {
//   const [categories, setCategories] = useState<{ id: number; name: string }[]>(
//     []
//   );
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         "http://localhost:3001/admin/categories",
//         getAuthConfig()
//       );
//       setCategories(res.data);
//     } catch (err) {
//       setError("Failed to load categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   return { categories, loading, error, refetch: fetchCategories };
// };
