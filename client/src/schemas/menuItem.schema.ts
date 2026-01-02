import { z } from "zod";

export const CategorySchema = z.enum(["starters", "main course", "desserts"]);

export const MenuItemApiSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.union([z.string(), z.number()]),
  imageUrl: z.string().nullable(),
  category: z
    .object({
      name: z.string(),
    })
    .nullable(),
});

export const MenuItemApiResponseSchema = z.array(MenuItemApiSchema);

export type MenuItemApi = z.infer<typeof MenuItemApiSchema>;
export type CategoryType = z.infer<typeof CategorySchema>;
