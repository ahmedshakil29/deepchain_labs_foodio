"use client";

import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import axios from "axios";
import { z } from "zod";
import Input from "@/app/(components)/commons/InputTextBox";
import Button from "@/app/(components)/commons/Button";
import { getAuthConfig } from "@/utils/auth";

// Zod schema for validation
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

type MenuItemFormData = z.infer<typeof menuItemSchema>;

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
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Fetch categories on modal open
  // useEffect(() => {
  //   if (!isOpen) return;

  //   const fetchCategories = async () => {
  //     try {
  //       setIsLoadingCategories(true);
  //       // const token = localStorage.getItem("token");
  //       // const res = await axios.get("http://localhost:1/admin/categories", {
  //       //   headers: { Authorization: `Bearer ${token}` },
  //       // });
  //       const res = await axios.get(
  //         "http://localhost:3000/admin/categories",
  //         getAuthConfig()
  //       );
  //       setCategories(res.data);
  //       if (res.data.length && !formData.category) {
  //         setFormData((prev) => ({ ...prev, category: res.data[0].name }));
  //       }
  //     } catch (err) {
  //       setUploadError("Failed to load categories");
  //     } finally {
  //       setIsLoadingCategories(false);
  //     }
  //   };

  //   fetchCategories();
  // }, [isOpen]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await axios.get(
          "http://localhost:3001/admin/categories",
          getAuthConfig()
        );
        setCategories(response.data);
        // Set first category as default
        if (response.data.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: response.data[0].name }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setUploadError("Failed to load categories");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field])
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setImageFile(file);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();
  const handleRemoveFile = () => setImageFile(null);

  const uploadImageToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      data
    );
    return res.data.secure_url;
  };

  const handleSubmit = async () => {
    setErrors({});
    setUploadError("");
    setIsSubmitting(true);

    try {
      const validatedData = menuItemSchema.parse({
        ...formData,
        image: imageFile || undefined,
      });
      let imageUrl = "";
      if (imageFile) imageUrl = await uploadImageToCloudinary(imageFile);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      await axios.post(
        "http://localhost:3001/admin/createmenuitem",
        {
          name: validatedData.name,
          price: validatedData.price,
          categoryName: validatedData.category,
          description: validatedData.description,
          imageUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFormData({
        name: "",
        price: "",
        category: categories[0]?.name || "",
        description: "",
      });
      setImageFile(null);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const zodErrors: Record<string, string> = {};
        err.issues.forEach((e) => {
          if (e.path[0]) zodErrors[e.path[0] as string] = e.message;
        });
        setErrors(zodErrors);
      } else {
        setUploadError(
          err.response?.data?.message || err.message || "Something went wrong"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-[12px] bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between sticky top-0 bg-white z-10 pb-4">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Add New Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Name & Price */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#333]">
                Name
              </label>
              <Input
                placeholder="e.g. Cheese Burger"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#333]">
                Price
              </label>
              <Input
                placeholder="e.g. 299"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-500">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#333]">
              Category
            </label>
            {isLoadingCategories ? (
              <div className="h-10 w-full rounded border px-3 flex items-center text-gray-500">
                Loading...
              </div>
            ) : categories.length === 0 ? (
              <div className="h-10 w-full rounded border px-3 flex items-center text-red-500">
                No categories found
              </div>
            ) : (
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="h-10 w-full rounded border px-3 outline-none focus:ring-2 focus:ring-green-700"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
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
              placeholder="Description of the menu item"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
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
              <div className="mt-2 flex items-center justify-between rounded border px-3 py-2 bg-white">
                <span className="text-xs">{imageFile.name}</span>
                <button
                  onClick={handleRemoveFile}
                  className="text-gray-500 hover:text-gray-900"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="rounded bg-red-50 p-2 text-red-600 text-xs">
              {uploadError}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end pt-2">
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
// import { z } from "zod";
// import axios from "axios";
// import Input from "@/app/(components)/commons/InputTextBox";
// import Button from "@/app/(components)/commons/Button";

// // Zod schema
// const menuItemSchema = z.object({
//   name: z
//     .string()
//     .min(1, "Name is required")
//     .max(100, "Name must be less than 100 characters"),
//   price: z
//     .string()
//     .min(1, "Price is required")
//     .refine(
//       (val) => !isNaN(Number(val)) && Number(val) > 0,
//       "Price must be a positive number"
//     ),
//   category: z.string().min(1, "Category is required"),
//   description: z
//     .string()
//     .min(1, "Description is required")
//     .max(500, "Description must be less than 500 characters"),
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
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [uploadError, setUploadError] = useState("");
//   const [isLoadingCategories, setIsLoadingCategories] = useState(false);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setIsLoadingCategories(true);
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:3001/admin/categories", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCategories(res.data);
//         if (res.data.length > 0 && !formData.category) {
//           setFormData((prev) => ({ ...prev, category: res.data[0].name }));
//         }
//       } catch (err) {
//         console.error(err);
//         setUploadError("Failed to load categories");
//       } finally {
//         setIsLoadingCategories(false);
//       }
//     };

//     if (isOpen) fetchCategories();
//   }, [isOpen]);

//   // Input change
//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[field];
//         return copy;
//       });
//     }
//   };

//   // File select
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) setImageFile(file);
//   };

//   // Drag & Drop
//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files?.[0];
//     if (file) setImageFile(file);
//   };
//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
//     e.preventDefault();
//   const handleRemoveFile = () => setImageFile(null);

//   // Upload to Cloudinary
//   const uploadImageToCloudinary = async (file: File) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append(
//       "upload_preset",
//       process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
//     );
//     const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
//     const res = await axios.post(
//       `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
//       formData
//     );
//     return res.data.secure_url;
//   };

//   // Submit form
//   const handleSubmit = async () => {
//     try {
//       setErrors({});
//       setUploadError("");
//       setIsSubmitting(true);

//       // Validate
//       const validatedData = menuItemSchema.parse({
//         ...formData,
//         image: imageFile || undefined,
//       });

//       // Upload image if exists
//       let imageUrl = "";
//       if (imageFile) imageUrl = await uploadImageToCloudinary(imageFile);

//       // Prepare backend data
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setUploadError("Unauthorized. Please login.");
//         setIsSubmitting(false);
//         return;
//       }

//       const backendForm = {
//         name: validatedData.name,
//         price: validatedData.price,
//         categoryName: validatedData.category,
//         description: validatedData.description,
//         imageUrl,
//       };

//       await axios.post(
//         "http://localhost:3001/admin/createmenuitem",
//         backendForm,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // Reset
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
//       console.error(err);
//       if (err instanceof z.ZodError) {
//         const zodErrors: Record<string, string> = {};
//         err.issues.forEach((e) => {
//           if (e.path[0]) zodErrors[e.path[0] as string] = e.message;
//         });
//         setErrors(zodErrors);
//       } else {
//         setUploadError(err.response?.data?.message || "Something went wrong");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-[12px] bg-white p-[32px] shadow-2xl">
//         {/* Header */}
//         <div className="mb-6 flex items-center justify-between sticky top-0 bg-white z-10 pb-4">
//           <h2 className="text-[20px] font-semibold text-[#1A1A1A]">
//             Add New Item
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-[#7A7A7A] hover:text-[#333]"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="space-y-5">
//           {/* Name & Price */}
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="mb-2 block text-sm font-medium text-[#333]">
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
//               <label className="mb-2 block text-sm font-medium text-[#333]">
//                 Price
//               </label>
//               <Input
//                 placeholder="e.g. 299"
//                 type="text"
//                 value={formData.price}
//                 onChange={(e) => handleInputChange("price", e.target.value)}
//               />
//               {errors.price && (
//                 <p className="mt-1 text-xs text-red-500">{errors.price}</p>
//               )}
//             </div>
//           </div>

//           {/* Category */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-[#333]">
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
//             <label className="mb-2 block text-sm font-medium text-[#333]">
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

//           {/* Image Upload */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-[#333]">
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
//             {errors.image && (
//               <p className="mt-1 text-xs text-red-500">{errors.image}</p>
//             )}
//           </div>

//           {/* Info / Error */}
//           <div className="rounded bg-blue-50 p-2 text-blue-600 text-xs">
//             ℹ️ New items are automatically available for order
//           </div>
//           {uploadError && (
//             <div className="rounded bg-red-50 p-2 text-red-600 text-xs">
//               {uploadError}
//             </div>
//           )}

//           {/* Submit */}
//           <div className="flex justify-end pt-2">
//             <Button
//               text={isSubmitting ? "Saving..." : "Save Changes"}
//               onClick={handleSubmit}
//               width="w-36"
//               height="h-10"
//               bgColor="#1A3C34"
//               textColor="#FFF"
//               className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
