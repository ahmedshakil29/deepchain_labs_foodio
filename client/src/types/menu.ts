// src/types/menu.ts
export type MenuItem = {
  id: number;
  name: string;
  category: string; // category name
  categoryId?: number;
  price: string; // formatted price for UI
  rawPrice?: number; // numeric price from backend
  description: string;
  image?: string;
  availableForOrder: boolean;
};

export type CreateMenuItemPayload = {
  name: string;
  price: string;
  categoryName: string;
  description: string;
  imageUrl?: string | null;
  isAvailable?: boolean;
};

export type MenuItemApiResponse = {
  id: number;
  name: string;
  price: number;
  category?: {
    id: number;
    name: string;
  } | null;
  categoryId?: number;
  description?: string | null;
  imageUrl?: string | null;
  isAvailable?: boolean | null;
};

export type UpdateMenuItemPayload = Partial<CreateMenuItemPayload>;

// ✔ Used in:

// MenuItemsPage

// AddMenuItemModal

// EditItemModal

// Axios requests
