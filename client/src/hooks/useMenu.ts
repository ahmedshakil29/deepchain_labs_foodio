"use client";

import { useEffect, useState } from "react";
import {
  MenuItem,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
} from "@/types/menu";
import { MenuService } from "@/services/menu.service";
import toast from "react-hot-toast";

type ItemLoadingState = {
  [key: number]: {
    deleting?: boolean;
    updating?: boolean;
  };
};

export const useMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false); // list loading
  const [itemLoading, setItemLoading] = useState<ItemLoadingState>({}); // per-item loading

  // Fetch all menu items
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await MenuService.getAll();
      setItems(data);
    } catch {
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  // Delete a menu item
  const deleteItem = async (id: number) => {
    try {
      setItemLoading((prev) => ({ ...prev, [id]: { deleting: true } }));
      await MenuService.delete(id);
      toast.success("Item deleted");
      fetchMenu();
    } catch {
      toast.error("Delete failed");
    } finally {
      setItemLoading((prev) => ({ ...prev, [id]: { deleting: false } }));
    }
  };

  // Update a menu item
  const updateItem = async (id: number, payload: UpdateMenuItemPayload) => {
    try {
      setItemLoading((prev) => ({ ...prev, [id]: { updating: true } }));
      await MenuService.update(id, payload);
      toast.success("Item updated");
      fetchMenu();
    } catch {
      toast.error("Update failed");
    } finally {
      setItemLoading((prev) => ({ ...prev, [id]: { updating: false } }));
    }
  };

  // Create a new menu item
  const createItem = async (payload: CreateMenuItemPayload) => {
    try {
      setLoading(true); // for creation, we can use the main loading
      await MenuService.create(payload);
      toast.success("Item created");
      fetchMenu();
    } catch {
      toast.error("Creation failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return {
    items,
    loading, // list loading & creation
    refetch: fetchMenu,
    deleteItem,
    updateItem,
    createItem,
    itemLoading, // per-item loading states
  };
};

// "use client";

// import { useEffect, useState } from "react";
// import {
//   MenuItem,
//   CreateMenuItemPayload,
//   UpdateMenuItemPayload,
// } from "@/types/menu";
// import { MenuService } from "@/services/menu.service";
// import toast from "react-hot-toast";

// export const useMenu = () => {
//   const [items, setItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch all menu items
//   const fetchMenu = async () => {
//     try {
//       setLoading(true);
//       const data = await MenuService.getAll();
//       setItems(data);
//     } catch {
//       toast.error("Failed to load menu items");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete a menu item
//   const deleteItem = async (id: number) => {
//     try {
//       await MenuService.delete(id);
//       toast.success("Item deleted");
//       fetchMenu();
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   // Create a new menu item
//   const createItem = async (payload: CreateMenuItemPayload) => {
//     try {
//       await MenuService.create(payload);
//       toast.success("Item created");
//       fetchMenu();
//     } catch {
//       toast.error("Creation failed");
//     }
//   };

//   // Update an existing menu item
//   const updateItem = async (id: number, payload: UpdateMenuItemPayload) => {
//     try {
//       await MenuService.update(id, payload);
//       toast.success("Item updated");
//       fetchMenu();
//     } catch {
//       toast.error("Update failed");
//     }
//   };

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   return {
//     items,
//     loading,
//     refetch: fetchMenu,
//     deleteItem,
//     createItem,
//     updateItem,
//   };
// };
