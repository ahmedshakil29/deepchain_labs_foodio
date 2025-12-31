// import { z } from "zod";

// export const createMenuItemSchema = z.object({
//   name: z.string().min(1).max(100),
//   price: z.coerce.number().positive(),
//   categoryId: z.number().int(),
//   description: z.string().min(1).max(500),
//   image: z
//     .instanceof(File)
//     .optional()
//     .refine(
//       (file) => !file || file.size <= 2 * 1024 * 1024,
//       "Image must be ≤ 2MB"
//     )
//     .refine(
//       (file) =>
//         !file || ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
//       "Invalid image format"
//     ),
// });

// export type CreateMenuItemForm = z.infer<typeof createMenuItemSchema>;
