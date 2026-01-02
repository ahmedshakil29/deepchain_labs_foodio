// src/services/category.service.ts
import api from "./api";
import { Category, CategoryApiResponse } from "@/types/category";

export const CategoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get<CategoryApiResponse[]>("/admin/categories");

    // map API response to Category type safely
    return res.data.map((item) => ({
      id: item.id,
      name: item.name,
      isActive: item.isActive ?? true, // default true if missing
      createdAt: item.createdAt ?? new Date().toISOString(),
      updatedAt: item.updatedAt ?? new Date().toISOString(),
    }));
  },

  create: async (name: string): Promise<void> => {
    await api.post("/admin/createcategory", { name });
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/deletecategory/${id}`);
  },
};

// import api from "./api";
// import { Category } from "@/types/category";

// export const createCategory = async (data: { name: string }) => {
//   const res = await api.post("/admin/createcategory", data);
//   return res.data;
// };

// export const getCategories = async (): Promise<Category[]> => {
//   const res = await api.get("/admin/categories");
//   return res.data;
// };

// export const deleteCategory = async (id: number) => {
//   return api.delete(`/admin/deletecategory/${id}`);
// };
