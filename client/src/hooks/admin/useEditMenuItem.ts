import { MenuItemFormData, menuItemSchema } from "@/schemas/menu.schema";
import { updateMenuItem } from "@/services/menu.service";

export function useEditMenuItem(menuItemId: number) {
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

    await updateMenuItem(menuItemId, fd);
  };

  return { submit };
}
