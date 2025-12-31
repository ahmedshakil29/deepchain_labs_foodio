import { useEffect, useState } from "react";
import { z } from "zod";
import { createMenuItemSchema } from "@/schemas/menuItemSchema";
import { getCategories } from "@/services/category.service";
import { createMenuItem } from "@/services/menu.service";

export function useAddMenuItem(isOpen: boolean) {
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setIsLoadingCategories(true);
    getCategories()
      .then(setCategories)
      .catch(() => setError("Failed to load categories"))
      .finally(() => setIsLoadingCategories(false));
  }, [isOpen]);

  const submit = async (form: any, image?: File | null) => {
    const parsed = createMenuItemSchema.parse({
      ...form,
      image: image || undefined,
    });

    const fd = new FormData();
    Object.entries(parsed).forEach(([k, v]) => {
      if (v !== undefined) fd.append(k, String(v));
    });

    if (parsed.image) fd.append("image", parsed.image);

    setIsSubmitting(true);
    await createMenuItem(fd);
    setIsSubmitting(false);
  };

  return {
    categories,
    submit,
    isSubmitting,
    isLoadingCategories,
    error,
  };
}
