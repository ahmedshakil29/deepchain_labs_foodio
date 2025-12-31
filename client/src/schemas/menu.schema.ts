import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(1).max(100),
  price: z
    .string()
    .min(1)
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0),
  category: z.string().min(1),
  description: z.string().min(1).max(500),
  image: z
    .instanceof(File)
    .optional()
    .refine((f) => !f || f.size <= 2 * 1024 * 1024)
    .refine(
      (f) => !f || ["image/png", "image/jpeg", "image/jpg"].includes(f.type)
    ),
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;
