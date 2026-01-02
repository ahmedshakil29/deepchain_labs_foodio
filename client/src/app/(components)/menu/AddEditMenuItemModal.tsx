// "use client";
// import { useState, useEffect } from "react";
// import { X, Upload } from "lucide-react";
// import { z } from "zod";
// import Input from "@/app/(components)/commons/InputTextBox";
// import Button from "@/app/(components)/commons/Button";
// import { uploadImageToCloudinary } from "@/utils/cloudinary";
// import { useCategories } from "@/hooks/useCategories";
// import { useCreateMenuItem, useUpdateMenuItem } from "@/hooks/useMenuItem";

// const menuItemSchema = z.object({
//   name: z.string().min(1, "Name is required").max(100),
//   price: z
//     .string()
//     .min(1, "Price is required")
//     .refine(
//       (val) => !isNaN(Number(val)) && Number(val) > 0,
//       "Price must be positive"
//     ),
//   category: z.string().min(1, "Category is required"),
//   description: z.string().min(1, "Description is required").max(500),
//   image: z.instanceof(File).optional(),
// });

// type MenuItemForm = z.infer<typeof menuItemSchema>;

// type AddEditMenuItemModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess?: () => void;
//   itemToEdit?: {
//     id: number;
//     name: string;
//     price: string;
//     category: string;
//     description: string;
//     imageUrl?: string;
//   };
// };

// export default function AddEditMenuItemModal({
//   isOpen,
//   onClose,
//   onSuccess,
//   itemToEdit,
// }: AddEditMenuItemModalProps) {
//   const { categories, loading: loadingCategories } = useCategories();
//   const { createMenuItem } = useCreateMenuItem();
//   const { updateMenuItem } = useUpdateMenuItem();

//   const [form, setForm] = useState<MenuItemForm>({
//     name: "",
//     price: "",
//     category: "",
//     description: "",
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [submitError, setSubmitError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fill form for edit
//   useEffect(() => {
//     if (itemToEdit) {
//       setForm({
//         name: itemToEdit.name,
//         price: itemToEdit.price,
//         category: itemToEdit.category,
//         description: itemToEdit.description,
//       });
//     } else {
//       setForm((prev) => ({ ...prev, category: categories[0]?.name || "" }));
//     }
//   }, [itemToEdit, categories]);

//   const handleInputChange = (field: keyof MenuItemForm, value: string) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//     if (errors[field])
//       setErrors((prev) => {
//         const e = { ...prev };
//         delete e[field];
//         return e;
//       });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) setImageFile(file);
//   };

//   const handleSubmit = async () => {
//     try {
//       setErrors({});
//       setSubmitError("");
//       setIsSubmitting(true);

//       const validated = menuItemSchema.parse({
//         ...form,
//         image: imageFile || undefined,
//       });

//       let imageUrl: string | undefined = itemToEdit?.imageUrl;
//       if (imageFile) imageUrl = await uploadImageToCloudinary(imageFile);

//       const payload = { ...validated, imageUrl };
//       delete payload.image;

//       if (itemToEdit) {
//         await updateMenuItem(itemToEdit.id, payload);
//       } else {
//         await createMenuItem(payload);
//       }

//       onSuccess?.();
//       onClose();
//     } catch (err: any) {
//       if (err instanceof z.ZodError) {
//         const e: Record<string, string> = {};
//         err.issues.forEach((issue) => {
//           if (issue.path[0]) e[issue.path[0] as string] = issue.message;
//         });
//         setErrors(e);
//       } else {
//         setSubmitError(err.message);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-[12px] bg-white p-[32px] shadow-2xl">
//         <div className="mb-[24px] flex items-center justify-between sticky top-0 bg-white z-10 pb-4">
//           <h2 className="text-[20px] font-semibold">
//             {itemToEdit ? "Edit Item" : "Add New Item"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-[#7A7A7A] hover:text-[#333]"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="space-y-[20px]">
//           {/* Name & Price */}
//           <div className="flex gap-[16px]">
//             <div className="flex-1">
//               <label className="mb-[8px] block text-[14px] font-medium">
//                 Name
//               </label>
//               <Input
//                 value={form.name}
//                 onChange={(e) => handleInputChange("name", e.target.value)}
//                 placeholder="e.g. Cheese Burger"
//                 width="w-full"
//                 height="h-[40px]"
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-[12px]">{errors.name}</p>
//               )}
//             </div>
//             <div className="flex-1">
//               <label className="mb-[8px] block text-[14px] font-medium">
//                 Price
//               </label>
//               <Input
//                 value={form.price}
//                 onChange={(e) => handleInputChange("price", e.target.value)}
//                 placeholder="e.g. 299"
//                 width="w-full"
//                 height="h-[40px]"
//               />
//               {errors.price && (
//                 <p className="text-red-500 text-[12px]">{errors.price}</p>
//               )}
//             </div>
//           </div>

//           {/* Category */}
//           <div>
//             <label className="mb-[8px] block text-[14px] font-medium">
//               Category
//             </label>
//             {loadingCategories ? (
//               <div className="h-[40px] w-full rounded border px-[12px] flex items-center text-gray-500">
//                 Loading categories...
//               </div>
//             ) : categories.length === 0 ? (
//               <div className="h-[40px] w-full rounded border px-[12px] flex items-center text-red-500">
//                 No categories found
//               </div>
//             ) : (
//               <select
//                 value={form.category}
//                 onChange={(e) => handleInputChange("category", e.target.value)}
//                 className="h-[40px] w-full rounded border px-[12px] outline-none focus:ring-2 focus:ring-green-700"
//               >
//                 {categories.map((c) => (
//                   <option key={c.id} value={c.name}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             )}
//             {errors.category && (
//               <p className="text-red-500 text-[12px]">{errors.category}</p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="mb-[8px] block text-[14px] font-medium">
//               Description
//             </label>
//             <textarea
//               value={form.description}
//               onChange={(e) => handleInputChange("description", e.target.value)}
//               className="h-[100px] w-full rounded border px-[12px] py-[8px] outline-none focus:ring-2 focus:ring-green-700"
//               placeholder="Description"
//             />
//             {errors.description && (
//               <p className="text-red-500 text-[12px]">{errors.description}</p>
//             )}
//           </div>

//           {/* Image Upload */}
//           <div>
//             <label className="mb-[8px] block text-[14px] font-medium">
//               Image (Optional)
//             </label>
//             <div
//               className="flex h-[100px] w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed bg-gray-100"
//               onClick={() => document.getElementById("file-upload")?.click()}
//             >
//               <Upload size={20} className="mb-[4px] text-gray-500" />
//               <p className="text-[12px]">Click to upload or drag and drop</p>
//               <input
//                 id="file-upload"
//                 type="file"
//                 accept="image/png,image/jpeg,image/jpg"
//                 className="hidden"
//                 onChange={handleFileChange}
//               />
//             </div>
//             {imageFile && (
//               <p className="text-[12px] mt-[4px]">{imageFile.name}</p>
//             )}
//           </div>

//           {submitError && (
//             <p className="text-red-500 text-[12px]">{submitError}</p>
//           )}

//           <div className="flex justify-end pt-[8px]">
//             <Button
//               text={isSubmitting ? "Saving..." : "Save"}
//               onClick={handleSubmit}
//               width="w-[140px]"
//               height="h-[40px]"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
