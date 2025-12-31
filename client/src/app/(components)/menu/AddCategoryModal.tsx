"use client";

import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { z } from "zod";
import Input from "@/app/(components)/commons/InputTextBox";
import Button from "@/app/(components)/commons/Button";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50),
});

type AddCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      const validated = categorySchema.parse({ name });
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      await axios.post(
        "http://localhost:3001/admin/createcategory",
        { name: validated.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName("");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      if (err instanceof z.ZodError)
        setError(err.issues[0]?.message || "Invalid input");
      else
        setError(
          err.response?.data?.message || err.message || "Something went wrong"
        );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-[400px] rounded-[12px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Add Category</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#333]">
              Category Name
            </label>
            <Input
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

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

// import { useState } from "react";
// import { X } from "lucide-react";
// import { z } from "zod";
// import axios from "axios";
// import Input from "@/app/(components)/commons/InputTextBox";
// import Button from "@/app/(components)/commons/Button";
// import { getAuthConfig } from "@/utils/auth";

// // Zod validation schema
// const categorySchema = z.object({
//   name: z
//     .string()
//     .min(1, "Name is required")
//     .max(50, "Name must be less than 50 characters"),
// });

// type AddCategoryModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess?: () => void;
// };

// export default function AddCategoryModal({
//   isOpen,
//   onClose,
//   onSuccess,
// }: AddCategoryModalProps) {
//   const [name, setName] = useState("");
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState("");

//   const handleSubmit = async () => {
//     try {
//       setError("");
//       setApiError("");
//       setIsSubmitting(true);

//       // Validate with Zod
//       const validatedData = categorySchema.parse({ name });

//       const token = localStorage.getItem("token");
//       if (!token) {
//         setApiError("Unauthorized. Please login again.");
//         return;
//       }

//       console.log("📤 Creating category...");

//       // Send data to backend
//       await axios.post(
//         "http://localhost:3001/admin/createcategory",
//         { name: validatedData.name },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("✅ Category created successfully!");

//       // Success - reset form and close modal
//       setName("");
//       onSuccess?.();
//       onClose();
//     } catch (err) {
//       console.error("❌ Error creating category:", err);

//       if (err instanceof z.ZodError) {
//         setError(err.issues[0].message);
//       } else if (axios.isAxiosError(err)) {
//         console.error("API Error:", err.response?.data);
//         setApiError(err.response?.data?.message || "Failed to create category");
//       } else {
//         setApiError("An unexpected error occurred");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="relative w-full max-w-[380px] rounded-[12px] bg-white p-[24px] shadow-2xl">
//         {/* Header */}
//         <div className="mb-[20px] flex items-center justify-between">
//           <h2 className="text-[18px] font-semibold text-[#1A1A1A]">
//             Add Category
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-[#7A7A7A] transition hover:text-[#333333]"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="space-y-[16px]">
//           {/* Name Input */}
//           <div>
//             <label className="mb-[8px] block text-[14px] font-medium text-[#333333]">
//               Name
//             </label>
//             <Input
//               placeholder="e.g. Beverages"
//               value={name}
//               onChange={(e) => {
//                 setName(e.target.value);
//                 setError("");
//                 setApiError("");
//               }}
//               width="w-full"
//               height="h-[40px]"
//             />
//             {error && (
//               <p className="mt-[4px] text-[12px] text-red-500">{error}</p>
//             )}
//           </div>

//           {/* API Error message */}
//           {apiError && (
//             <div className="rounded-[6px] bg-red-50 p-[10px] text-[12px] text-red-600">
//               {apiError}
//             </div>
//           )}

//           {/* Submit Button */}
//           <div className="flex justify-end pt-[8px]">
//             <Button
//               text={isSubmitting ? "Adding..." : "Add"}
//               onClick={handleSubmit}
//               width="w-[80px]"
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
