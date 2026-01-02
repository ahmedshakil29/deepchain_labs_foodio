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

// Zod schema
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
  availableForOrder: z.boolean(), // ✅ include boolean
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
  const { categories } = useCategories();
  const { updateItem, refetch: refetchMenu } = useMenu();

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
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        price:
          item.rawPrice?.toString() || item.price.replace(/[৳$]/g, "").trim(),
        category: item.category || categories[0]?.name || "",
        description: item.description,
        availableForOrder: item.availableForOrder,
      });
      setExistingImage(item.image || "");
      setImageFile(null);
    }
  }, [item, categories]);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
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
  const handleRemoveExistingImage = () => setExistingImage("");

  const handleSubmit = async () => {
    if (!item) return;

    try {
      setIsSubmitting(true);
      setErrors({});
      setUploadError("");

      // ✅ parse full form with availableForOrder
      const validatedData = menuItemSchema.parse({
        ...formData,
        image: imageFile || undefined,
      });

      let imageUrl = existingImage || "";
      if (imageFile) imageUrl = await uploadImageToCloudinary(imageFile);

      // ✅ update via hook (not service)
      await updateItem(item.id as number, {
        name: validatedData.name,
        price: validatedData.price,
        categoryName: validatedData.category,
        description: validatedData.description,
        imageUrl: imageUrl || null,
        isAvailable: validatedData.availableForOrder,
      });

      refetchMenu();
      onSuccess?.();
      onClose();
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

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between sticky top-0 bg-white z-10 pb-4">
          <h2 className="text-lg font-semibold text-[#1A3C34]">Edit Item</h2>
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

          {/* Available for Order */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                handleInputChange(
                  "availableForOrder",
                  !formData.availableForOrder
                )
              }
              className={`h-5 w-5 rounded-full border-2 transition ${
                formData.availableForOrder
                  ? "border-green-700 bg-green-700"
                  : "border-gray-300 bg-white"
              }`}
            >
              {formData.availableForOrder && (
                <div className="flex h-full items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              )}
            </button>
            <span className="text-sm text-gray-700">Available for Order</span>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-[#333]">
              Image (Optional)
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() =>
                document.getElementById("file-upload-edit")?.click()
              }
              className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed bg-gray-50 hover:bg-gray-100"
            >
              <Upload size={20} className="mb-1 text-gray-500" />
              <p className="text-xs text-gray-600">
                Click or drag & drop PNG/JPEG (max 2MB)
              </p>
              <input
                id="file-upload-edit"
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {(existingImage || imageFile) && (
              <div className="mt-2 relative h-24 w-full rounded border overflow-hidden">
                <Image
                  src={
                    imageFile ? URL.createObjectURL(imageFile) : existingImage
                  }
                  alt={formData.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => {
                    handleRemoveFile();
                    handleRemoveExistingImage();
                  }}
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
// import { z } from "zod";
// import axios from "axios";
// import Input from "@/app/(components)/commons/InputTextBox";
// import Button from "@/app/(components)/commons/Button";
// import Image from "next/image";

// // Zod validation schema
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
//   availableForOrder: z.boolean(),
// });

// type MenuItem = {
//   id: string | number;
//   name: string;
//   price: string;
//   category: string;
//   description: string;
//   image?: string;
//   availableForOrder: boolean;
//   rawPrice?: number;
// };
// type Category = {
//   id: number;
//   name: string;
// };
// type EditItemModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess?: () => void;
//   item: MenuItem | null;
//   categories: Category[]; // ✅ added
// };

// export default function EditItemModal({
//   isOpen,
//   onClose,
//   onSuccess,
//   item,
//   categories,
// }: EditItemModalProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     category: "",
//     description: "",
//     availableForOrder: false,
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [existingImage, setExistingImage] = useState<string>("");
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [uploadError, setUploadError] = useState("");

//   useEffect(() => {
//     if (item) {
//       setFormData({
//         name: item.name,
//         price:
//           item.rawPrice?.toString() || item.price.replace(/[৳$]/g, "").trim(),
//         category: item.category,
//         description: item.description,
//         availableForOrder: item.availableForOrder,
//       });
//       setExistingImage(item.image || "");
//       setImageFile(null);
//     }
//   }, [item]);
//   useEffect(() => {
//     if (item) {
//       console.log("🟢 Current item:", item);
//     }
//   }, [item]);

//   const handleInputChange = (field: string, value: string | boolean) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       const newErrors = { ...errors };
//       delete newErrors[field];
//       setErrors(newErrors);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setUploadError("");
//       if (errors.image) {
//         const newErrors = { ...errors };
//         delete newErrors.image;
//         setErrors(newErrors);
//       }
//     }
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setUploadError("");
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
//     e.preventDefault();

//   const handleRemoveFile = () => setImageFile(null);

//   const handleRemoveExistingImage = () => setExistingImage("");

//   // Cloudinary upload function
//   const uploadToCloudinary = async (file: File) => {
//     try {
//       const data = new FormData();
//       data.append("file", file);
//       data.append(
//         "upload_preset",
//         process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
//       );

//       const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
//       const res = await axios.post(
//         `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
//         data
//       );
//       return res.data.secure_url;
//     } catch (err) {
//       console.error("Cloudinary upload failed", err);
//       throw new Error("Failed to upload image");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!item) return;

//     try {
//       setErrors({});
//       setIsSubmitting(true);
//       setUploadError("");

//       const validatedData = menuItemSchema.parse({
//         ...formData,
//         image: imageFile || undefined,
//       });

//       let imageUrl = existingImage || "";

//       if (imageFile) {
//         imageUrl = await uploadToCloudinary(imageFile);
//       }

//       const payload = {
//         name: validatedData.name,
//         price: validatedData.price,
//         categoryName: validatedData.category,
//         description: validatedData.description,
//         isAvailable: validatedData.availableForOrder,
//         imageUrl: imageUrl || null, // send null if image removed
//       };

//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Unauthorized");

//       await axios.patch(
//         `http://localhost:3001/admin/updatemenuitem/${item.id}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       onSuccess?.();
//       onClose();
//     } catch (error: any) {
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
//         setUploadError(error.message || "An unexpected error occurred");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen || !item) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-[12px] bg-white p-[32px] shadow-2xl">
//         {/* Header */}
//         <div className="mb-[20px] flex items-center justify-between sticky top-0 bg-white z-10 pb-4">
//           <h2 className="text-[20px] font-semibold text-[#1A3C34]">
//             Edit Item
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-[#7A7A7A] transition hover:text-[#333333]"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="space-y-[16px]">
//           {/* Name & Price */}
//           <div className="flex gap-[12px]">
//             <div className="flex-1">
//               <label className="mb-[6px] block text-[13px] font-medium text-[#333333]">
//                 Name
//               </label>
//               <Input
//                 placeholder="e.g. Cheese Burger"
//                 value={formData.name}
//                 onChange={(e) => handleInputChange("name", e.target.value)}
//                 width="w-full"
//                 height="h-[38px]"
//               />
//               {errors.name && (
//                 <p className="mt-[4px] text-[11px] text-red-500">
//                   {errors.name}
//                 </p>
//               )}
//             </div>
//             <div className="flex-1">
//               <label className="mb-[6px] block text-[13px] font-medium text-[#333333]">
//                 Price
//               </label>
//               <Input
//                 placeholder="e.g. 299"
//                 value={formData.price}
//                 onChange={(e) => handleInputChange("price", e.target.value)}
//                 type="text"
//                 width="w-full"
//                 height="h-[38px]"
//               />
//               {errors.price && (
//                 <p className="mt-[4px] text-[11px] text-red-500">
//                   {errors.price}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Category */}
//           <div>
//             <label className="mb-[6px] block text-[13px] font-medium text-[#333333]">
//               Category
//             </label>
//             {/* <select
//               value={formData.category}
//               onChange={(e) => handleInputChange("category", e.target.value)}
//               className="h-[38px] w-full rounded-[6px] border border-[#E6E2D8] px-[12px] text-[14px] text-[#333333] outline-none focus:ring-2 focus:ring-[#0B5D1E]"
//             >
//               <option value="Starters">Starters</option>
//               <option value="Main Course">Main Course</option>
//               <option value="Desserts">Desserts</option>
//               <option value="Beverages">Beverages</option>
//               <option value="Appetizers">Appetizers</option>
//             </select> */}
//             <select
//               value={formData.category}
//               onChange={(e) => handleInputChange("category", e.target.value)}
//               className="h-[38px] w-full rounded-[6px] border border-[#E6E2D8] px-[12px] text-[14px] text-[#333333] outline-none focus:ring-2 focus:ring-[#0B5D1E]"
//             >
//               {categories
//                 .sort((a, b) => a.name.localeCompare(b.name))
//                 .map((cat) => (
//                   <option key={cat.id} value={cat.name}>
//                     {cat.name}
//                   </option>
//                 ))}
//             </select>

//             {errors.category && (
//               <p className="mt-[4px] text-[11px] text-red-500">
//                 {errors.category}
//               </p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="mb-[6px] block text-[13px] font-medium text-[#333333]">
//               Description
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => handleInputChange("description", e.target.value)}
//               className="h-[80px] w-full resize-none rounded-[6px] border border-[#E6E2D8] px-[12px] py-[8px] text-[14px] text-[#333333] placeholder:text-[#7A7A7A] outline-none focus:ring-2 focus:ring-[#0B5D1E]"
//               placeholder="e.g. Delicious grilled chicken"
//             />
//             {errors.description && (
//               <p className="mt-[4px] text-[11px] text-red-500">
//                 {errors.description}
//               </p>
//             )}
//           </div>

//           {/* Image */}
//           <div>
//             <label className="mb-[6px] block text-[13px] font-medium text-[#333333]">
//               Image (Optional)
//             </label>
//             <div
//               onDrop={handleDrop}
//               onDragOver={handleDragOver}
//               className="flex h-[90px] w-full cursor-pointer flex-col items-center justify-center rounded-[6px] border-2 border-dashed border-[#E6E2D8] bg-[#FAFAFA] transition hover:bg-[#F5F5F5]"
//               onClick={() =>
//                 document.getElementById("file-upload-edit")?.click()
//               }
//             >
//               <Upload className="mb-[4px] text-[#7A7A7A]" size={20} />
//               <p className="text-[12px] text-[#333333]">
//                 <span className="font-medium">Click to upload</span> or drag
//               </p>
//               <p className="mt-[2px] text-[10px] text-[#7A7A7A]">
//                 PNG/JPEG (max 2MB)
//               </p>
//               <input
//                 id="file-upload-edit"
//                 type="file"
//                 accept="image/png,image/jpeg,image/jpg"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </div>
//             {errors.image && (
//               <p className="mt-[4px] text-[11px] text-red-500">
//                 {errors.image}
//               </p>
//             )}

//             {/* {imageFile && (
//               <div className="mt-[8px] flex items-center justify-between rounded-[6px] border border-[#E6E2D8] bg-white px-[10px] py-[6px]">
//                 <span className="text-[12px] text-[#333333]">
//                   {imageFile.name.length > 25
//                     ? `${imageFile.name.substring(0, 25)}...`
//                     : imageFile.name}
//                 </span>
//                 <button
//                   onClick={handleRemoveFile}
//                   className="text-[#7A7A7A] transition hover:text-[#333333]"
//                 >
//                   <X size={14} />
//                 </button>
//               </div>
//             )} */}
//             {/* Image Preview */}
//             {(existingImage || imageFile) && (
//               <div className="mb-[8px] relative w-full h-[120px] rounded-[6px] my-2 overflow-hidden border border-[#E6E2D8]">
//                 {/* <img
//                   src={
//                     imageFile
//                       ? URL.createObjectURL(imageFile) // preview new upload
//                       : existingImage // show current image
//                   }
//                   alt="Menu Item"
//                   className="h-full w-full object-cover"
//                 /> */}
//                 <Image
//                   src={
//                     imageFile
//                       ? URL.createObjectURL(imageFile) // preview new upload
//                       : existingImage // show current image
//                   }
//                   alt={formData.name}
//                   width={150}
//                   height={100}
//                   className="rounded-md"
//                 />
//                 <button
//                   onClick={() => {
//                     handleRemoveFile();
//                     handleRemoveExistingImage();
//                   }}
//                   className="absolute top-[4px] right-[4px] rounded bg-black/30 p-1 text-white hover:bg-black/50"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Available for Order */}
//           <div className="flex items-center gap-[10px]">
//             <button
//               type="button"
//               onClick={() =>
//                 handleInputChange(
//                   "availableForOrder",
//                   !formData.availableForOrder
//                 )
//               }
//               className={`h-[18px] w-[18px] rounded-full border-2 transition ${
//                 formData.availableForOrder
//                   ? "border-[#0B5D1E] bg-[#0B5D1E]"
//                   : "border-[#E6E2D8] bg-white"
//               }`}
//             >
//               {formData.availableForOrder && (
//                 <div className="flex h-full items-center justify-center">
//                   <div className="h-[7px] w-[7px] rounded-full bg-white" />
//                 </div>
//               )}
//             </button>
//             <label className="text-[13px] text-[#333333]">
//               Available for Order
//             </label>
//           </div>

//           {uploadError && (
//             <div className="rounded-[6px] bg-red-50 p-[10px] text-[12px] text-red-600">
//               {uploadError}
//             </div>
//           )}

//           <div className="flex justify-end pt-[6px]">
//             <Button
//               text={isSubmitting ? "Saving..." : "Save Changes"}
//               onClick={handleSubmit}
//               width="w-[140px]"
//               height="h-[38px]"
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
