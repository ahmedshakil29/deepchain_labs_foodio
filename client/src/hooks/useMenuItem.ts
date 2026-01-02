import { useState, useEffect } from "react";
import { MenuItem } from "@/types/types";
import { menuService } from "@/services/menu.service";

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMenuItems = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await menuService.getMenuItems();
      const transformed: MenuItem[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category?.name || "N/A",
        categoryId: item.categoryId,
        price: `${item.price}`,
        rawPrice: item.price,
        description: item.description || "",
        image: item.imageUrl || undefined,
        availableForOrder: item.isAvailable,
      }));
      setMenuItems(transformed);
    } catch (err: any) {
      setError("Failed to fetch menu items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return { menuItems, loading, error, fetchMenuItems };
};

// // src/hooks/useMenuItem.ts
// import axios from "axios";
// import { useState } from "react";
// import { getAuthConfig } from "@/utils/auth";

// export const useCreateMenuItem = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const createMenuItem = async (data: any) => {
//     setLoading(true);
//     setError("");
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Unauthorized");
//       await axios.post("http://localhost:3001/admin/createmenuitem", data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { createMenuItem, loading, error };
// };

// export const useUpdateMenuItem = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const updateMenuItem = async (id: number, data: any) => {
//     setLoading(true);
//     setError("");
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Unauthorized");
//       await axios.patch(
//         `http://localhost:3001/admin/updatemenuitem/${id}`,
//         data,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { updateMenuItem, loading, error };
// };
