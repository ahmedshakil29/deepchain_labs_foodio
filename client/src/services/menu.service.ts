import api from "./api";
import {
  MenuItem,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
  MenuItemApiResponse,
} from "@/types/menu";

export const MenuService = {
  getAll: async (): Promise<MenuItem[]> => {
    const res = await api.get<MenuItemApiResponse[]>("/admin/menu");

    return res.data.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category?.name ?? "N/A",
      categoryId: item.categoryId,
      price: String(item.price), // formatted string for UI
      rawPrice: item.price,
      description: item.description ?? "",
      image: item.imageUrl ?? undefined,
      availableForOrder: Boolean(item.isAvailable),
    }));
  },

  create: async (payload: CreateMenuItemPayload): Promise<void> => {
    await api.post("/admin/createmenuitem", payload);
  },

  update: async (id: number, payload: UpdateMenuItemPayload): Promise<void> => {
    await api.patch(`/admin/updatemenuitem/${id}`, payload);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/menuitem/${id}`);
  },
};

// import axios from "axios";
// import {
//   MenuItem,
//   Category,
//   CreateMenuItemPayload,
//   UpdateMenuItemPayload,
// } from "@/types/menu";
// import { getAuthConfig } from "@/utils/auth";

// const API = "http://localhost:3001/admin";

// /* ---------- MENU ---------- */

// export const menuService = {
//   async getMenuItems(): Promise<MenuItem[]> {
//     const res = await axios.get(`${API}/menu`, getAuthConfig());
//     return res.data.map((item: any) => ({
//       id: item.id,
//       name: item.name,
//       category: item.category?.name ?? "N/A",
//       price: String(item.price),
//       rawPrice: item.price,
//       description: item.description ?? "",
//       image: item.imageUrl ?? undefined,
//       availableForOrder: item.isAvailable,
//     }));
//   },

//   async createMenuItem(payload: CreateMenuItemPayload) {
//     return axios.post(`${API}/createmenuitem`, payload, getAuthConfig());
//   },

//   async updateMenuItem(id: number, payload: UpdateMenuItemPayload) {
//     return axios.patch(`${API}/updatemenuitem/${id}`, payload, getAuthConfig());
//   },

//   async deleteMenuItem(id: number) {
//     return axios.delete(`${API}/menuitem/${id}`, getAuthConfig());
//   },

//   /* ---------- CATEGORY ---------- */

//   async getCategories(): Promise<Category[]> {
//     const res = await axios.get(`${API}/categories`, getAuthConfig());
//     return res.data;
//   },

//   async createCategory(name: string) {
//     return axios.post(`${API}/createcategory`, { name }, getAuthConfig());
//   },

//   async deleteCategory(id: number) {
//     return axios.delete(`${API}/deletecategory/${id}`, getAuthConfig());
//   },
// };
//-------------------------------------   last
// import api from "./api";
// import { MenuItem } from "@/types/menu";

// export const createMenuItem = async (formData: FormData) => {
//   const res = await api.post("/admin/createmenuitem", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data;
// };

// export const updateMenuItem = async (id: number, data: Partial<FormData>) => {
//   return api.patch(`/admin/updatemenuitem/${id}`, data);
// };

// export const deleteMenuItem = async (id: number) => {
//   return api.delete(`/admin/menuitem/${id}`);
// };

// export const getMenuItems = async (category?: string): Promise<MenuItem[]> => {
//   const res = await api.get("/admin/menu", {
//     params: { category },
//   });
//   return res.data;
// };
