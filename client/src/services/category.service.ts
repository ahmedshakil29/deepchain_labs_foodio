import api from "./api";
import { Category } from "@/types/category";

export const createCategory = async (data: { name: string }) => {
  const res = await api.post("/admin/createcategory", data);
  return res.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get("/admin/categories");
  return res.data;
};

export const deleteCategory = async (id: number) => {
  return api.delete(`/admin/deletecategory/${id}`);
};
