import { menuItemSchema, MenuItemFormData } from "@/schemas/menu.schema";
import { createMenuItem } from "@/services/menu.service";
import { z } from "zod";

export function useCreateMenuItem() {
  const submit = async (data: MenuItemFormData, imageFile: File | null) => {
    const validated = menuItemSchema.parse({
      ...data,
      image: imageFile || undefined,
    });

    const fd = new FormData();
    fd.append("name", validated.name);
    fd.append("price", validated.price);
    fd.append("categoryName", validated.category);
    fd.append("description", validated.description);
    if (imageFile) fd.append("image", imageFile);

    await createMenuItem(fd);
  };

  return { submit };
}

// import { useState } from "react";
// import { createMenuItem } from "@/services/menu.service";

// export function useCreateMenuItem() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const submit = async (data: FormData) => {
//     try {
//       setLoading(true);
//       await createMenuItem(data);
//     } catch (err) {
//       setError("Failed to create menu item");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { submit, loading, error };
// }
