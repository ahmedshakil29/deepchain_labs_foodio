"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { z } from "zod";
import Input from "@/app/(components)/commons/InputTextBox";
import Button from "@/app/(components)/commons/Button";
import { useCategories } from "@/hooks/useCategories";

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

  const { createCategory } = useCategories(false); // hook without auto-fetch

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const validated = categorySchema.parse({ name });

      // Call hook's createCategory instead of axios
      await createCategory(validated.name);

      setName("");
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message || "Invalid input");
      } else if (err instanceof Error) {
        setError(err.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
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
// import axios from "axios";
// import { z } from "zod";
// import Input from "@/app/(components)/commons/InputTextBox";
// import Button from "@/app/(components)/commons/Button";

// const categorySchema = z.object({
//   name: z.string().min(1, "Category name is required").max(50),
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

//   const handleSubmit = async () => {
//     setError("");
//     setIsSubmitting(true);
//     try {
//       const validated = categorySchema.parse({ name });
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Unauthorized");

//       await axios.post(
//         "http://localhost:3001/admin/createcategory",
//         { name: validated.name },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setName("");
//       onSuccess?.();
//       onClose();
//     } catch (err: any) {
//       if (err instanceof z.ZodError)
//         setError(err.issues[0]?.message || "Invalid input");
//       else
//         setError(
//           err.response?.data?.message || err.message || "Something went wrong"
//         );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="relative w-full max-w-[400px] rounded-[12px] bg-white p-6 shadow-2xl">
//         <div className="mb-6 flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-[#1A1A1A]">Add Category</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-900"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-[#333]">
//               Category Name
//             </label>
//             <Input
//               placeholder="Category Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
//           </div>

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
