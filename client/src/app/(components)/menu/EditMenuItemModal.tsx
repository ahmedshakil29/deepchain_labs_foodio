"use client";

import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { z } from "zod";
import axios from "axios";
import Input from "@/app/(components)/commons/InputTextBox";
import Button from "@/app/(components)/commons/Button";

// Zod validation schema
const menuItemSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Price must be a positive number"
    ),
  category: z.string().min(1, "Category is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 2 * 1024 * 1024,
      "Image size must be maximum 2MB"
    )
    .refine(
      (file) =>
        !file || ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      "Only PNG and JPEG formats are supported"
    ),
  availableForOrder: z.boolean(),
});

type MenuItem = {
  id: string | number;
  name: string;
  price: string;
  category: string;
  description: string;
  image?: string;
  availableForOrder: boolean;
  rawPrice?: number;
};

type EditItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  item: MenuItem | null;
};

export default function EditItemModal({
  isOpen,
  onClose,
  onSuccess,
  item,
}: EditItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    availableForOrder: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        price:
          item.rawPrice?.toString() || item.price.replace(/[৳$]/g, "").trim(),
        category: item.category,
        description: item.description,
        availableForOrder: item.availableForOrder,
      });
      setExistingImage(item.image || "");
      setImageFile(null);
    }
  }, [item]);

  const handleInputChange = (field: string, value: string | boolean) => {
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
    if (file) {
      setImageFile(file);
      setUploadError("");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleRemoveFile = () => setImageFile(null);

  const handleRemoveExistingImage = () => setExistingImage("");

  // Cloudinary upload function
  const uploadToCloudinary = async (file: File) => {
    try {
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
    } catch (err) {
      console.error("Cloudinary upload failed", err);
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async () => {
    if (!item) return;

    try {
      setErrors({});
      setIsSubmitting(true);
      setUploadError("");

      const validatedData = menuItemSchema.parse({
        ...formData,
        image: imageFile || undefined,
      });

      let imageUrl = existingImage || "";

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = {
        name: validatedData.name,
        price: validatedData.price,
        categoryName: validatedData.category,
        description: validatedData.description,
        isAvailable: validatedData.availableForOrder,
        imageUrl: imageUrl || null, // send null if image removed
      };

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      await axios.patch(
        `http://localhost:3001/admin/updatemenuitem/${item.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess?.();
      onClose();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
      } else if (axios.isAxiosError(error)) {
        setUploadError(
          error.response?.data?.message || "Failed to update menu item"
        );
      } else {
        setUploadError(error.message || "An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-[12px] bg-white p-[32px] shadow-2xl">
        {/* Header */}
        <div className="mb-[20px] flex items-center justify-between sticky top-0 bg-white z-10 pb-4">
          <h2 className="text-[20px] font-semibold text-[#1A1A1A]">
            Edit Item
          </h2>
          <button
            onClick={onClose}
            className="text-[#7A7A7A] transition hover:text-[#333333]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-[16px]">
          {/* Name & Price */}
          <div className="flex gap-[12px]">
            <div className="flex-1">
              <label className="mb-[6px] block text-[13px] font-medium text-[#333333]">
                Name
              </label>
              <Input
                placeholder="e.g. Cheese Burger"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                width="w-full"
                height="h-[38px]"
              />
              {errors.name && (
                <p className="mt-[4px] text-[11px] text-red-500">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="mb-[6px] block text-[13px] font-medium text-[#333333]">
                Price
              </label>
              <Input
                placeholder="e.g. 299"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                type="text"
                width="w-full"
                height="h-[38px]"
              />
              {errors.price && (
                <p className="mt-[4px] text-[11px] text-red-500">
                  {errors.price}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="mb-[6px] block text-[13px] font-medium text-[#333333]">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="h-[38px] w-full rounded-[6px] border border-[#E6E2D8] px-[12px] text-[14px] text-[#333333] outline-none focus:ring-2 focus:ring-[#0B5D1E]"
            >
              <option value="Starters">Starters</option>
              <option value="Main Course">Main Course</option>
              <option value="Desserts">Desserts</option>
              <option value="Beverages">Beverages</option>
              <option value="Appetizers">Appetizers</option>
            </select>
            {errors.category && (
              <p className="mt-[4px] text-[11px] text-red-500">
                {errors.category}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-[6px] block text-[13px] font-medium text-[#333333]">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="h-[80px] w-full resize-none rounded-[6px] border border-[#E6E2D8] px-[12px] py-[8px] text-[14px] text-[#333333] placeholder:text-[#7A7A7A] outline-none focus:ring-2 focus:ring-[#0B5D1E]"
              placeholder="e.g. Delicious grilled chicken"
            />
            {errors.description && (
              <p className="mt-[4px] text-[11px] text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="mb-[6px] block text-[13px] font-medium text-[#333333]">
              Image (Optional)
            </label>

            {/* Existing image */}
            {existingImage && !imageFile && (
              <div className="mb-[8px] flex items-center justify-between rounded-[6px] border border-[#E6E2D8] bg-white px-[10px] py-[6px]">
                <span className="text-[12px] text-[#333333]">
                  Current image
                </span>
                <button
                  onClick={handleRemoveExistingImage}
                  className="text-[#7A7A7A] transition hover:text-[#333333]"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Upload area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex h-[90px] w-full cursor-pointer flex-col items-center justify-center rounded-[6px] border-2 border-dashed border-[#E6E2D8] bg-[#FAFAFA] transition hover:bg-[#F5F5F5]"
              onClick={() =>
                document.getElementById("file-upload-edit")?.click()
              }
            >
              <Upload className="mb-[4px] text-[#7A7A7A]" size={20} />
              <p className="text-[12px] text-[#333333]">
                <span className="font-medium">Click to upload</span> or drag
              </p>
              <p className="mt-[2px] text-[10px] text-[#7A7A7A]">
                PNG/JPEG (max 2MB)
              </p>
              <input
                id="file-upload-edit"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {errors.image && (
              <p className="mt-[4px] text-[11px] text-red-500">
                {errors.image}
              </p>
            )}

            {imageFile && (
              <div className="mt-[8px] flex items-center justify-between rounded-[6px] border border-[#E6E2D8] bg-white px-[10px] py-[6px]">
                <span className="text-[12px] text-[#333333]">
                  {imageFile.name.length > 25
                    ? `${imageFile.name.substring(0, 25)}...`
                    : imageFile.name}
                </span>
                <button
                  onClick={handleRemoveFile}
                  className="text-[#7A7A7A] transition hover:text-[#333333]"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Available for Order */}
          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              onClick={() =>
                handleInputChange(
                  "availableForOrder",
                  !formData.availableForOrder
                )
              }
              className={`h-[18px] w-[18px] rounded-full border-2 transition ${
                formData.availableForOrder
                  ? "border-[#0B5D1E] bg-[#0B5D1E]"
                  : "border-[#E6E2D8] bg-white"
              }`}
            >
              {formData.availableForOrder && (
                <div className="flex h-full items-center justify-center">
                  <div className="h-[7px] w-[7px] rounded-full bg-white" />
                </div>
              )}
            </button>
            <label className="text-[13px] text-[#333333]">
              Available for Order
            </label>
          </div>

          {uploadError && (
            <div className="rounded-[6px] bg-red-50 p-[10px] text-[12px] text-red-600">
              {uploadError}
            </div>
          )}

          <div className="flex justify-end pt-[6px]">
            <Button
              text={isSubmitting ? "Saving..." : "Save Changes"}
              onClick={handleSubmit}
              width="w-[140px]"
              height="h-[38px]"
              bgColor="#1A3C34"
              textColor="#FFFFFF"
              className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

//1st --------------------
// "use client";

// import { useState, useEffect } from "react";
// import { X, Upload } from "lucide-react";
// import axios from "axios";
// import { z } from "zod";
// import Input from "@/app/(components)/commons/InputTextBox";
// import Button from "@/app/(components)/commons/Button";
// import { toast } from "react-hot-toast";
// const menuItemSchema = z.object({
//   name: z.string().min(1, "Name is required").max(100),
//   price: z
//     .string()
//     .min(1, "Price is required")
//     .refine(
//       (val) => !isNaN(Number(val)) && Number(val) > 0,
//       "Price must be positive"
//     ),
//   categoryId: z.number({ invalid_type_error: "Category is required" }),
//   description: z.string().min(1, "Description is required").max(500),
//   image: z.instanceof(File).optional(),
// });

// type MenuItemFormData = z.infer<typeof menuItemSchema>;

// type EditMenuItemModalProps = {
//   isOpen: boolean;
//   menuItemId: number;
//   onClose: () => void;
//   onSuccess?: () => void;
// };

// export default function EditMenuItemModal({
//   isOpen,
//   menuItemId,
//   onClose,
//   onSuccess,
// }: EditMenuItemModalProps) {
//   const [formData, setFormData] = useState<MenuItemFormData>({
//     name: "",
//     price: "",
//     categoryId: 0,
//     description: "",
//   });
//   const [categories, setCategories] = useState<{ id: number; name: string }[]>(
//     []
//   );
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [uploadError, setUploadError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (!isOpen) return;
//     if (!menuItemId) return;

//     toast.success(String(menuItemId));

//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         setUploadError("");

//         // Fetch menu item
//         const menuRes = await axios.get(
//           `http://localhost:3001/admin/menuitem/${menuItemId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         // Fetch categories
//         const catRes = await axios.get(
//           "http://localhost:3001/admin/categories",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         setFormData({
//           name: menuRes.data.name,
//           price: menuRes.data.price.toString(),
//           categoryId: menuRes.data.categoryId,
//           description: menuRes.data.description || "",
//         });
//         setCategories(catRes.data);
//       } catch (err: any) {
//         console.error(err);
//         setUploadError("Failed to load data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [isOpen, menuItemId]);

//   const handleInputChange = (field: string, value: string | number) => {
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

//   // const handleSubmit = async () => {
//   //   setErrors({});
//   //   setUploadError("");
//   //   setIsSubmitting(true);

//   //   try {
//   //     const validatedData = menuItemSchema.parse({
//   //       ...formData,
//   //       image: imageFile || undefined,
//   //     });

//   //     let imageUrl = "";
//   //     if (imageFile) imageUrl = await uploadImageToCloudinary(imageFile);

//   //     const token = localStorage.getItem("token");
//   //     if (!token) throw new Error("Unauthorized");

//   //     await axios.put(
//   //       `http://localhost:3001/admin/menuitem/${menuItemId}`,
//   //       {
//   //         name: validatedData.name,
//   //         price: validatedData.price,
//   //         categoryId: validatedData.categoryId,
//   //         description: validatedData.description,
//   //         imageUrl,
//   //       },
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );

//   //     onSuccess?.();
//   //     onClose();
//   //   } catch (err: any) {
//   //     if (err instanceof z.ZodError) {
//   //       const zodErrors: Record<string, string> = {};
//   //       err.issues.forEach((e) => {
//   //         if (e.path[0]) zodErrors[e.path[0] as string] = e.message;
//   //       });
//   //       setErrors(zodErrors);
//   //     } else {
//   //       setUploadError(
//   //         err.response?.data?.message || err.message || "Something went wrong"
//   //       );
//   //     }
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };
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

//       // Map categoryId to categoryName
//       const selectedCategory = categories.find(
//         (c) => c.id === validatedData.categoryId
//       );
//       const categoryName = selectedCategory?.name || "";

//       await axios.put(
//         `http://localhost:3001/admin/menuitem/${menuItemId}`,
//         {
//           name: validatedData.name,
//           price: validatedData.price,
//           categoryName, // send name instead of id
//           description: validatedData.description,
//           imageUrl,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

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
//         <div className="mb-6 flex items-center justify-between sticky top-0 bg-white z-10 pb-4">
//           <h2 className="text-lg font-semibold text-[#1A1A1A]">Edit Item</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-900"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {isLoading ? (
//           <p className="text-center text-gray-500">Loading...</p>
//         ) : (
//           <div className="space-y-5">
//             <Input
//               label="Name"
//               placeholder="Name"
//               value={formData.name}
//               onChange={(e) => handleInputChange("name", e.target.value)}
//               error={errors.name}
//             />
//             <Input
//               label="Price"
//               placeholder="Price"
//               value={formData.price}
//               onChange={(e) => handleInputChange("price", e.target.value)}
//               error={errors.price}
//             />

//             <div>
//               <label className="block text-sm font-medium text-[#333]">
//                 Category
//               </label>
//               <select
//                 value={formData.categoryId}
//                 onChange={(e) =>
//                   handleInputChange("categoryId", Number(e.target.value))
//                 }
//                 className="h-10 w-full rounded border px-3 outline-none focus:ring-2 focus:ring-green-700"
//               >
//                 <option value={0}>Select Category</option>
//                 {categories.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.categoryId && (
//                 <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-[#333]">
//                 Description
//               </label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) =>
//                   handleInputChange("description", e.target.value)
//                 }
//                 className="h-24 w-full resize-none rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
//                 placeholder="Description"
//               />
//               {errors.description && (
//                 <p className="mt-1 text-xs text-red-500">
//                   {errors.description}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-[#333]">
//                 Image (Optional)
//               </label>
//               <div
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 onClick={() => document.getElementById("file-upload")?.click()}
//                 className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed bg-gray-50 hover:bg-gray-100"
//               >
//                 <Upload size={20} className="mb-1 text-gray-500" />
//                 <p className="text-xs text-gray-600">
//                   Click or drag & drop PNG/JPEG
//                 </p>
//                 <input
//                   id="file-upload"
//                   type="file"
//                   accept="image/png,image/jpeg"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </div>
//               {imageFile && (
//                 <div className="mt-2 flex items-center justify-between rounded border px-3 py-2 bg-white">
//                   <span className="text-xs">{imageFile.name}</span>
//                   <button
//                     onClick={handleRemoveFile}
//                     className="text-gray-500 hover:text-gray-900"
//                   >
//                     <X size={14} />
//                   </button>
//                 </div>
//               )}
//             </div>

//             {uploadError && (
//               <div className="rounded bg-red-50 p-2 text-red-600 text-xs">
//                 {uploadError}
//               </div>
//             )}

//             <div className="flex justify-end pt-2">
//               <Button
//                 text={isSubmitting ? "Saving..." : "Save"}
//                 onClick={handleSubmit}
//                 className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//2nd
// "use client";

// import { useState, useEffect } from "react";
// import { X, Upload } from "lucide-react";
// import axios from "axios";
// import { z } from "zod";
// import Input from "@/app/(components)/commons/InputTextBox";
// import Button from "@/app/(components)/commons/Button";

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

// type EditMenuItemModalProps = {
//   isOpen: boolean;
//   menuItemId: number;
//   onClose: () => void;
//   onSuccess?: () => void;
// };

// export default function EditMenuItemModal({
//   isOpen,
//   menuItemId,
//   onClose,
//   onSuccess,
// }: EditMenuItemModalProps) {
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

//   useEffect(() => {
//     if (!isOpen) return;

//     const token = localStorage.getItem("token");
//     const fetchData = async () => {
//       try {
//         setIsLoadingCategories(true);

//         const [menuRes, catRes] = await Promise.all([
//           axios.get(`http://localhost:3001/admin/menuitem/${menuItemId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("http://localhost:3001/admin/categories", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         setFormData({
//           name: menuRes.data.name,
//           price: menuRes.data.price.toString(),
//           category: menuRes.data.categoryName,
//           description: menuRes.data.description,
//         });
//         setCategories(catRes.data);
//       } catch {
//         setUploadError("Failed to load data");
//       } finally {
//         setIsLoadingCategories(false);
//       }
//     };

//     fetchData();
//   }, [isOpen, menuItemId]);

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

//       await axios.put(
//         `http://localhost:3001/admin/menuitem/${menuItemId}`,
//         {
//           name: validatedData.name,
//           price: validatedData.price,
//           categoryName: validatedData.category,
//           description: validatedData.description,
//           imageUrl,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

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
//         <div className="mb-6 flex items-center justify-between sticky top-0 bg-white z-10 pb-4">
//           <h2 className="text-lg font-semibold text-[#1A1A1A]">Edit Item</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-900"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="space-y-5">
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-[#333]">
//                 Name
//               </label>
//               <Input
//                 placeholder="Name"
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
//                 placeholder="Price"
//                 value={formData.price}
//                 onChange={(e) => handleInputChange("price", e.target.value)}
//               />
//               {errors.price && (
//                 <p className="mt-1 text-xs text-red-500">{errors.price}</p>
//               )}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-[#333]">
//               Category
//             </label>
//             {isLoadingCategories ? (
//               <div className="h-10 w-full rounded border px-3 flex items-center text-gray-500">
//                 Loading...
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

//           <div>
//             <label className="block text-sm font-medium text-[#333]">
//               Description
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => handleInputChange("description", e.target.value)}
//               className="h-24 w-full resize-none rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
//               placeholder="Description"
//             />
//             {errors.description && (
//               <p className="mt-1 text-xs text-red-500">{errors.description}</p>
//             )}
//           </div>

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
//                 Click or drag & drop PNG/JPEG
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
//3rd
// "use client";

// import { useState, useEffect } from "react";
// import { X, Upload } from "lucide-react";
// import { z } from "zod";
// import axios from "axios";
// import Input from "@/app/(components)/commons/InputTextBox";
// import Button from "@/app/(components)/commons/Button";
// import { getAuthConfig } from "@/utils/auth";

// // Zod validation schema
// export const menuItemSchema = z.object({
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
//   image: z
//     .instanceof(File)
//     .optional()
//     .refine(
//       (file) => !file || file.size <= 2 * 1024 * 1024,
//       "Image size must be maximum 2MB"
//     )
//     .refine(
//       (file) =>
//         !file || ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
//       "Only PNG and JPEG formats are supported"
//     ),
// });

// type EditMenuItemModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   menuItem: {
//     id: number;
//     name: string;
//     price: string;
//     category: string;
//     description: string;
//     imageUrl?: string;
//   };
//   onSuccess?: () => void;
// };

// export default function EditMenuItemModal({
//   isOpen,
//   onClose,
//   menuItem,
//   onSuccess,
// }: EditMenuItemModalProps) {
//   const [formData, setFormData] = useState({
//     name: menuItem.name,
//     price: menuItem.price,
//     category: menuItem.category,
//     description: menuItem.description,
//   });
//   const [categories, setCategories] = useState<{ id: number; name: string }[]>(
//     []
//   );
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [existingImage, setExistingImage] = useState(menuItem.imageUrl || "");
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [uploadError, setUploadError] = useState("");
//   const [isLoadingCategories, setIsLoadingCategories] = useState(false);

//   // Fetch categories from backend
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setIsLoadingCategories(true);
//         const response = await axios.get(
//           "http://localhost:3001/admin/categories",
//           getAuthConfig()
//         );
//         setCategories(response.data);
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

//     if (isOpen) fetchCategories();
//   }, [isOpen]);

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[field];
//         return newErrors;
//       });
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setExistingImage("");
//       setUploadError("");
//       if (errors.image) {
//         setErrors((prev) => {
//           const newErrors = { ...prev };
//           delete newErrors.image;
//           return newErrors;
//         });
//       }
//     }
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setExistingImage("");
//       setUploadError("");
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   const handleRemoveFile = () => {
//     setImageFile(null);
//     setExistingImage("");
//     setUploadError("");
//   };

//   const handleSubmit = async () => {
//     try {
//       setErrors({});
//       setIsSubmitting(true);
//       setUploadError("");

//       const validatedData = menuItemSchema.parse({
//         ...formData,
//         image: imageFile || undefined,
//       });

//       const formDataToSend = new FormData();
//       formDataToSend.append("name", validatedData.name);
//       formDataToSend.append("price", validatedData.price);
//       formDataToSend.append("categoryName", validatedData.category);
//       formDataToSend.append("description", validatedData.description);

//       if (imageFile) {
//         formDataToSend.append("image", imageFile);
//       }

//       const token = localStorage.getItem("token");
//       if (!token) {
//         setUploadError("Unauthorized. Please login as admin.");
//         setIsSubmitting(false);
//         return;
//       }

//       await axios.patch(
//         `http://localhost:3001/admin/updatemenuitem/${menuItem.id}`,
//         formDataToSend,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setFormData({
//         name: "",
//         price: "",
//         category: categories[0]?.name || "",
//         description: "",
//       });
//       setImageFile(null);
//       setExistingImage("");
//       onSuccess?.();
//       onClose();
//     } catch (error) {
//       console.error("Error updating menu item:", error);
//       if (error instanceof z.ZodError) {
//         const newErrors: Record<string, string> = {};
//         error.issues.forEach((err) => {
//           if (err.path[0]) newErrors[err.path[0] as string] = err.message;
//         });
//         setErrors(newErrors);
//       } else if (axios.isAxiosError(error)) {
//         setUploadError(
//           error.response?.data?.message || "Failed to update menu item"
//         );
//       } else {
//         setUploadError("An unexpected error occurred");
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
//         <div className="mb-[24px] flex items-center justify-between sticky top-0 bg-white z-10 pb-4">
//           <h2 className="text-[20px] font-semibold text-[#1A1A1A]">
//             Edit Menu Item
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-[#7A7A7A] transition hover:text-[#333333]"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="space-y-[20px]">
//           {/* Name & Price */}
//           <div className="flex gap-[16px]">
//             <div className="flex-1">
//               <label className="mb-[8px] block text-[14px] font-medium text-[#333333]">
//                 Name
//               </label>
//               <Input
//                 placeholder="e.g. Cheese Burger"
//                 value={formData.name}
//                 onChange={(e) => handleInputChange("name", e.target.value)}
//                 width="w-full"
//                 height="h-[40px]"
//               />
//               {errors.name && (
//                 <p className="mt-[4px] text-[12px] text-red-500">
//                   {errors.name}
//                 </p>
//               )}
//             </div>
//             <div className="flex-1">
//               <label className="mb-[8px] block text-[14px] font-medium text-[#333333]">
//                 Price
//               </label>
//               <Input
//                 placeholder="e.g. 299"
//                 value={formData.price}
//                 onChange={(e) => handleInputChange("price", e.target.value)}
//                 width="w-full"
//                 height="h-[40px]"
//               />
//               {errors.price && (
//                 <p className="mt-[4px] text-[12px] text-red-500">
//                   {errors.price}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Category */}
//           <div>
//             <label className="mb-[8px] block text-[14px] font-medium text-[#333333]">
//               Category
//             </label>
//             {isLoadingCategories ? (
//               <div className="h-[40px] w-full rounded-[6px] border border-[#E6E2D8] px-[12px] flex items-center text-[#7A7A7A]">
//                 Loading categories...
//               </div>
//             ) : categories.length === 0 ? (
//               <div className="h-[40px] w-full rounded-[6px] border border-[#E6E2D8] px-[12px] flex items-center text-red-500">
//                 No categories found
//               </div>
//             ) : (
//               <select
//                 value={formData.category}
//                 onChange={(e) => handleInputChange("category", e.target.value)}
//                 className="h-[40px] w-full rounded-[6px] border border-[#E6E2D8] px-[12px] text-[16px] text-[#333333] outline-none focus:ring-2 focus:ring-[#0B5D1E]"
//               >
//                 {categories.map((cat) => (
//                   <option key={cat.id} value={cat.name}>
//                     {cat.name}
//                   </option>
//                 ))}
//               </select>
//             )}
//             {errors.category && (
//               <p className="mt-[4px] text-[12px] text-red-500">
//                 {errors.category}
//               </p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="mb-[8px] block text-[14px] font-medium text-[#333333]">
//               Description
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => handleInputChange("description", e.target.value)}
//               className="h-[100px] w-full resize-none rounded-[6px] border border-[#E6E2D8] px-[12px] py-[8px] text-[16px] text-[#333333] placeholder:text-[#7A7A7A] outline-none focus:ring-2 focus:ring-[#0B5D1E]"
//             />
//             {errors.description && (
//               <p className="mt-[4px] text-[12px] text-red-500">
//                 {errors.description}
//               </p>
//             )}
//           </div>

//           {/* Image Upload */}
//           <div>
//             <label className="mb-[8px] block text-[14px] font-medium text-[#333333]">
//               Image (Optional)
//             </label>
//             <div
//               onDrop={handleDrop}
//               onDragOver={handleDragOver}
//               className="flex h-[100px] w-full cursor-pointer flex-col items-center justify-center rounded-[6px] border-2 border-dashed border-[#E6E2D8] bg-[#FAFAFA] transition hover:bg-[#F5F5F5]"
//               onClick={() => document.getElementById("file-upload")?.click()}
//             >
//               <Upload className="mb-[4px] text-[#7A7A7A]" size={20} />
//               <p className="text-[12px] text-[#333333]">
//                 <span className="font-medium">Click to upload</span> or drag and
//                 drop
//               </p>
//               <p className="mt-[2px] text-[10px] text-[#7A7A7A]">
//                 PNG or JPEG (max 2MB)
//               </p>
//               <input
//                 id="file-upload"
//                 type="file"
//                 accept="image/png,image/jpeg,image/jpg"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </div>
//             {(imageFile || existingImage) && (
//               <div className="mt-[8px] flex items-center justify-between rounded-[6px] border border-[#E6E2D8] bg-white px-[12px] py-[8px]">
//                 <span className="text-[12px] text-[#333333]">
//                   {imageFile?.name || existingImage}
//                 </span>
//                 <button
//                   onClick={handleRemoveFile}
//                   className="text-[#7A7A7A] transition hover:text-[#333333]"
//                 >
//                   <X size={14} />
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Error */}
//           {uploadError && (
//             <div className="rounded-[6px] bg-red-50 p-[10px] text-[12px] text-red-600">
//               {uploadError}
//             </div>
//           )}

//           {/* Submit */}
//           <div className="flex justify-end pt-[8px]">
//             <Button
//               text={isSubmitting ? "Saving..." : "Save Changes"}
//               onClick={handleSubmit}
//               width="w-[140px]"
//               height="h-[40px]"
//               bgColor="#1A3C34"
//               textColor="#FFFFFF"
//               className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
