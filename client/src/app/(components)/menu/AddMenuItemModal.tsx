"use client";

import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import Input from "@/app/(components)/commons/InputTextBox";
import Button from "@/app/(components)/commons/Button";

import { useCategories } from "@/hooks/useCategories";
import { useMenu } from "@/hooks/useMenu";
import { uploadImageToCloudinary } from "@/services/cloudinary.service";

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  price: z
    .string()
    .min(1, "Price is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Price must be positive"
    ),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required").max(500),
  image: z.instanceof(File).optional(),
});

type AddMenuItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function AddMenuItemModal({
  isOpen,
  onClose,
  onSuccess,
}: AddMenuItemModalProps) {
  const { categories } = useCategories();
  const { createItem, refetch: refetchMenu } = useMenu();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default category when categories load
  useEffect(() => {
    if (categories.length && !formData.category) {
      setFormData((prev) => ({ ...prev, category: categories[0].name }));
    }
  }, [categories]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setUploadError("");
      if (errors.image) {
        const newErrors = { ...errors };
        delete newErrors.image;
        setErrors(newErrors);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleRemoveFile = () => setImageFile(null);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrors({});
      setUploadError("");

      const validatedData = menuItemSchema.parse({
        ...formData,
        image: imageFile || undefined,
      });

      let imageUrl = "";
      if (imageFile) imageUrl = await uploadImageToCloudinary(imageFile);

      // ✅ Use hook instead of service
      await createItem({
        name: validatedData.name,
        price: validatedData.price,
        categoryName: validatedData.category,
        description: validatedData.description,
        imageUrl: imageUrl || null,
      });

      refetchMenu();
      onSuccess?.();
      onClose();

      // Reset form
      setFormData({
        name: "",
        price: "",
        category: categories[0]?.name || "",
        description: "",
      });
      setImageFile(null);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(newErrors);
      } else {
        setUploadError("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between sticky top-0 bg-white z-10 pb-4">
          <h2 className="text-lg font-semibold text-[#1A3C34]">Add New Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#333]">
              Name
            </label>
            <Input
              placeholder="e.g. Cheese Burger"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-[#333]">
              Price
            </label>
            <Input
              placeholder="e.g. 299"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#333]">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="h-10 w-full rounded border px-3 outline-none focus:ring-2 focus:ring-green-700"
            >
              {categories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#333]">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="h-24 w-full resize-none rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-[#333]">
              Image (Optional)
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById("file-upload")?.click()}
              className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed bg-gray-50 hover:bg-gray-100"
            >
              <Upload size={20} className="mb-1 text-gray-500" />
              <p className="text-xs text-gray-600">
                Click or drag & drop PNG/JPEG (max 2MB)
              </p>
              <input
                id="file-upload"
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {imageFile && (
              <div className="mt-2 relative h-24 w-full rounded border overflow-hidden">
                <Image
                  src={URL.createObjectURL(imageFile)}
                  alt={formData.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-1 right-1 rounded bg-black/30 p-1 text-white hover:bg-black/50"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              text={isSubmitting ? "Saving..." : "Save"}
              onClick={handleSubmit}
              className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { X, Upload } from "lucide-react";
// import axios from "axios";
// import { z } from "zod";
// import Input from "@/app/(components)/commons/InputTextBox";
// import Button from "@/app/(components)/commons/Button";
// import { getAuthConfig } from "@/utils/auth";

// // Zod schema for validation
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

// type MenuItemFormData = z.infer<typeof menuItemSchema>;

// type AddMenuItemModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess?: () => void;
// };

// export default function AddMenuItemModal({
//   isOpen,
//   onClose,
//   onSuccess,
// }: AddMenuItemModalProps) {
//   const [formData, setFormData] = useState<MenuItemFormData>({
//     name: "",
//     price: "",
//     category: "",
//     description: "",
//   });
//   const [categories, setCategories] = useState<{ id: number; name: string }[]>(
//     []
//   );
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [uploadError, setUploadError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoadingCategories, setIsLoadingCategories] = useState(false);

//   // Fetch categories on modal open
//   // useEffect(() => {
//   //   if (!isOpen) return;

//   //   const fetchCategories = async () => {
//   //     try {
//   //       setIsLoadingCategories(true);
//   //       // const token = localStorage.getItem("token");
//   //       // const res = await axios.get("http://localhost:1/admin/categories", {
//   //       //   headers: { Authorization: `Bearer ${token}` },
//   //       // });
//   //       const res = await axios.get(
//   //         "http://localhost:3000/admin/categories",
//   //         getAuthConfig()
//   //       );
//   //       setCategories(res.data);
//   //       if (res.data.length && !formData.category) {
//   //         setFormData((prev) => ({ ...prev, category: res.data[0].name }));
//   //       }
//   //     } catch (err) {
//   //       setUploadError("Failed to load categories");
//   //     } finally {
//   //       setIsLoadingCategories(false);
//   //     }
//   //   };

//   //   fetchCategories();
//   // }, [isOpen]);
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setIsLoadingCategories(true);
//         const response = await axios.get(
//           "http://localhost:3001/admin/categories",
//           getAuthConfig()
//         );
//         setCategories(response.data);
//         // Set first category as default
//         if (response.data.length > 0 && !formData.category) {
//           setFormData((prev) => ({ ...prev, category: response.data[0].name }));
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setUploadError("Failed to load categories");
//       } finally {
//         setIsLoadingCategories(false);
//       }
//     };

//     if (isOpen) {
//       fetchCategories();
//     }
//   }, [isOpen]);

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (errors[field])
//       setErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[field];
//         return copy;
//       });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) setImageFile(file);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files?.[0];
//     if (file) setImageFile(file);
//   };
//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
//     e.preventDefault();
//   const handleRemoveFile = () => setImageFile(null);

//   const uploadImageToCloudinary = async (file: File) => {
//     const data = new FormData();
//     data.append("file", file);
//     data.append(
//       "upload_preset",
//       process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
//     );
//     const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
//     const res = await axios.post(
//       `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
//       data
//     );
//     return res.data.secure_url;
//   };

//   const handleSubmit = async () => {
//     setErrors({});
//     setUploadError("");
//     setIsSubmitting(true);

//     try {
//       const validatedData = menuItemSchema.parse({
//         ...formData,
//         image: imageFile || undefined,
//       });
//       let imageUrl = "";
//       if (imageFile) imageUrl = await uploadImageToCloudinary(imageFile);

//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Unauthorized");

//       await axios.post(
//         "http://localhost:3001/admin/createmenuitem",
//         {
//           name: validatedData.name,
//           price: validatedData.price,
//           categoryName: validatedData.category,
//           description: validatedData.description,
//           imageUrl,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setFormData({
//         name: "",
//         price: "",
//         category: categories[0]?.name || "",
//         description: "",
//       });
//       setImageFile(null);
//       onSuccess?.();
//       onClose();
//     } catch (err: any) {
//       if (err instanceof z.ZodError) {
//         const zodErrors: Record<string, string> = {};
//         err.issues.forEach((e) => {
//           if (e.path[0]) zodErrors[e.path[0] as string] = e.message;
//         });
//         setErrors(zodErrors);
//       } else {
//         setUploadError(
//           err.response?.data?.message || err.message || "Something went wrong"
//         );
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-[12px] bg-white p-8 shadow-2xl">
//         {/* Header */}
//         <div className="mb-6 flex items-center justify-between sticky top-0 bg-white z-10 pb-4">
//           <h2 className="text-lg font-semibold text-[#1A1A1A]">Add New Item</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-900"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="space-y-5">
//           {/* Name & Price */}
//           {/* <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-[#333]">
//                 Name
//               </label>
//               <Input
//                 placeholder="e.g. Cheese Burger"
//                 value={formData.name}
//                 onChange={(e) => handleInputChange("name", e.target.value)}
//               />
//               {errors.name && (
//                 <p className="mt-1 text-xs text-red-500">{errors.name}</p>
//               )}
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-[#333]">
//                 Price
//               </label>
//               <Input
//                 placeholder="e.g. 299"
//                 value={formData.price}
//                 onChange={(e) => handleInputChange("price", e.target.value)}
//               />
//               {errors.price && (
//                 <p className="mt-1 text-xs text-red-500">{errors.price}</p>
//               )}
//             </div>
//           </div> */}
//           <div>
//             <label className="block text-sm font-medium text-[#333] mb-1">
//               Name
//             </label>
//             <Input
//               placeholder="e.g. Cheese Burger"
//               value={formData.name}
//               onChange={(e) => handleInputChange("name", e.target.value)}
//             />
//             {errors.name && (
//               <p className="mt-1 text-xs text-red-500">{errors.name}</p>
//             )}
//           </div>

//           {/* Price */}
//           <div>
//             <label className="block text-sm font-medium text-[#333] mb-1">
//               Price
//             </label>
//             <Input
//               placeholder="e.g. 299"
//               value={formData.price}
//               onChange={(e) => handleInputChange("price", e.target.value)}
//             />
//             {errors.price && (
//               <p className="mt-1 text-xs text-red-500">{errors.price}</p>
//             )}
//           </div>
//           {/* Category */}
//           <div>
//             <label className="block text-sm font-medium text-[#333]">
//               Category
//             </label>
//             {isLoadingCategories ? (
//               <div className="h-10 w-full rounded border px-3 flex items-center text-gray-500">
//                 Loading...
//               </div>
//             ) : categories.length === 0 ? (
//               <div className="h-10 w-full rounded border px-3 flex items-center text-red-500">
//                 No categories found
//               </div>
//             ) : (
//               <select
//                 value={formData.category}
//                 onChange={(e) => handleInputChange("category", e.target.value)}
//                 className="h-10 w-full rounded border px-3 outline-none focus:ring-2 focus:ring-green-700"
//               >
//                 {categories.map((c) => (
//                   <option key={c.id} value={c.name}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             )}
//             {errors.category && (
//               <p className="mt-1 text-xs text-red-500">{errors.category}</p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-[#333]">
//               Description
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => handleInputChange("description", e.target.value)}
//               className="h-24 w-full resize-none rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
//               placeholder="Description of the menu item"
//             />
//             {errors.description && (
//               <p className="mt-1 text-xs text-red-500">{errors.description}</p>
//             )}
//           </div>

//           {/* Image */}
//           <div>
//             <label className="block text-sm font-medium text-[#333]">
//               Image (Optional)
//             </label>
//             <div
//               onDrop={handleDrop}
//               onDragOver={handleDragOver}
//               onClick={() => document.getElementById("file-upload")?.click()}
//               className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed bg-gray-50 hover:bg-gray-100"
//             >
//               <Upload size={20} className="mb-1 text-gray-500" />
//               <p className="text-xs text-gray-600">
//                 Click or drag & drop PNG/JPEG (max 2MB)
//               </p>
//               <input
//                 id="file-upload"
//                 type="file"
//                 accept="image/png,image/jpeg"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </div>
//             {imageFile && (
//               <div className="mt-2 flex items-center justify-between rounded border px-3 py-2 bg-white">
//                 <span className="text-xs">{imageFile.name}</span>
//                 <button
//                   onClick={handleRemoveFile}
//                   className="text-gray-500 hover:text-gray-900"
//                 >
//                   <X size={14} />
//                 </button>
//               </div>
//             )}
//           </div>

//           {uploadError && (
//             <div className="rounded bg-red-50 p-2 text-red-600 text-xs">
//               {uploadError}
//             </div>
//           )}

//           {/* Submit */}
//           <div className="flex justify-end pt-2">
//             <Button
//               text={isSubmitting ? "Saving..." : "Save"}
//               onClick={handleSubmit}
//               className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
