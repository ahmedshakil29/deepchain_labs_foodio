import { Category } from "./category";

export type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
};

export type CreateMenuItemPayload = {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  image?: File;
};

export type UpdateMenuItemPayload = Partial<CreateMenuItemPayload>;
