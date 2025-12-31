import api from "./api";
import { MenuItem } from "@/types/menu";

export const createMenuItem = async (formData: FormData) => {
  const res = await api.post("/admin/createmenuitem", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateMenuItem = async (id: number, data: Partial<FormData>) => {
  return api.patch(`/admin/updatemenuitem/${id}`, data);
};

export const deleteMenuItem = async (id: number) => {
  return api.delete(`/admin/menuitem/${id}`);
};

export const getMenuItems = async (category?: string): Promise<MenuItem[]> => {
  const res = await api.get("/admin/menu", {
    params: { category },
  });
  return res.data;
};

// import api from "./api";

// /**
//  * Create new menu item (Admin)
//  */
// export const createMenuItem = async (formData: FormData) => {
//   const res = await api.post("/admin/createmenuitem", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return res.data;
// };

// /**
//  * Get menu items (Admin or Customer)
//  */
// export const getMenuItems = async () => {
//   const res = await api.get("/menu");
//   return res.data;
// };

// /**
//  * Delete menu item (Admin)
//  */
// export const deleteMenuItem = async (id: number) => {
//   return api.delete(`/admin/menu/${id}`);
// };

// /**
//  * Update menu item (Admin)
//  */
// export const updateMenuItem = async (id: number, data: FormData) => {
//   return api.patch(`/admin/menu/${id}`, data, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };
