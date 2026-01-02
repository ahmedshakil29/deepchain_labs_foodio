"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/(components)/commons/Button";
import AddNewItemModal from "@/app/(components)/menu/AddMenuItemModal";
import EditItemModal from "@/app/(components)/menu/EditMenuItemModal";
import AddCategoryModal from "@/app/(components)/menu/AddCategoryModal";
import { Trash, SquarePen } from "lucide-react";

import { useMenu } from "@/hooks/useMenu";
import { useCategories } from "@/hooks/useCategories";

export default function MenuItemsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"menuItems" | "categories">(
    "menuItems"
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  /** MENU HOOK **/
  const {
    items: menuItems,
    loading: menuLoading,
    refetch: refetchMenu,
    deleteItem: deleteMenuItem,
    itemLoading: menuItemLoading,
  } = useMenu();

  /** CATEGORY HOOK **/
  const {
    categories,
    loading: categoryLoading,
    refetch: refetchCategories,
    deleteCategory,
    itemLoading: categoryItemLoading,
  } = useCategories();

  const handleEditClick = (id: number) => {
    setSelectedItemId(id);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-8 bg-[#FFFFFF]">
      <h1 className="text-3xl font-semibold border-b-0 text-[#1A3C34] mb-8">
        Menu Management
      </h1>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        {/* <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("menuItems")}
            className={`pb-2 border-b-2 text-sm font-medium transition ${
              activeTab === "menuItems"
                ? "border-[#1A3C34] text-[#1A3C34]"
                : "border-transparent text-[#7A7A7A]"
            }`}
          >
            Menu Items
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-2 border-b-2 text-sm font-medium transition ${
              activeTab === "categories"
                ? "border-[#1A3C34] text-[#1A3C34]"
                : "border-transparent text-[#7A7A7A]"
            }`}
          >
            Categories
          </button>
        </div> */}
        {/* <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("menuItems")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "menuItems"
                ? "bg-white text-[#1A3C34] shadow-sm" // Active: White background with shadow
                : "text-[#7A7A7A] hover:bg-white/50 hover:text-[#1A3C34]" // Inactive: Transparent gray
            }`}
          >
            Menu Items
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "categories"
                ? "bg-white text-[#1A3C34] shadow-sm"
                : "text-[#7A7A7A] hover:bg-white/50 hover:text-[#1A3C34]"
            }`}
          >
            Categories
          </button>
        </div> */}
        <div className="inline-flex bg-[#F2EFE9] p-1 rounded-4xl">
          <button
            onClick={() => setActiveTab("menuItems")}
            className={`px-6 py-2 text-sm font-medium rounded-4xl transition-all duration-200 ${
              activeTab === "menuItems"
                ? "bg-white text-black" // Active tab
                : "text-gray-500" // Inactive tab
            }`}
          >
            Menu Items
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-2 text-sm font-medium rounded-4xl transition-all duration-200 ${
              activeTab === "categories"
                ? "bg-white text-black"
                : "text-gray-500"
            }`}
          >
            Categories
          </button>
        </div>

        {/* <div className="inline-flex bg-[#F2EFE9] p-1 rounded-4xl">
          <button className="px-6 py-2 bg-white text-black text-sm rounded-4xl font-medium ">
            Menu Items
          </button>
          <button className="px-6 py-2 text-gray-500 text-sm font-medium ">
            Categories
          </button>
        </div> */}
        {activeTab === "menuItems" ? (
          <Button
            text="+ Add Item"
            onClick={() => setIsAddModalOpen(true)}
            width="w-auto"
            height="h-[36px]"
            className="px-6"
          />
        ) : (
          <Button
            text="+ Add Category"
            onClick={() => setIsAddCategoryModalOpen(true)}
            width="w-auto"
            height="h-[36px]"
            className="px-6"
          />
        )}
      </div>

      {/* Tables */}
      {activeTab === "menuItems" ? (
        <div className="rounded-lg border border-[#E6E2D8] overflow-hidden">
          {menuLoading ? (
            <div className="py-12 text-center text-[#7A7A7A]">Loading...</div>
          ) : menuItems.length === 0 ? (
            <div className="py-12 text-center text-[#7A7A7A]">
              No menu items. Click &quot;+ Add Item&quot;
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#E6E2D8] border-b border-[#E6E2D8]">
                <tr>
                  <th className="text-left py-3 px-4 text-sm text-[#7A7A7A]">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-[#7A7A7A]">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-[#7A7A7A]">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-[#7A7A7A]">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-[#7A7A7A]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F9F9F9] transition border-b border-[#E6E2D8]"
                  >
                    <td className="py-4 px-4 text-sm text-[#1A3C34]">
                      {item.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-[#7A7A7A]">
                      {item.category}
                    </td>
                    <td className="py-4 px-4 text-sm text-[#1A3C34]">
                      {item.price}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          item.availableForOrder
                            ? "bg-[#D1FAE5] text-[#065F46]"
                            : "bg-[#FEE2E2] text-[#DC2626]"
                        }`}
                      >
                        {item.availableForOrder ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(item.id)}
                          className="p-1 hover:bg-[#E6E2D8] rounded transition"
                          title="Edit"
                        >
                          <SquarePen size={16} />
                        </button>
                        <button
                          onClick={() => deleteMenuItem(item.id)}
                          disabled={menuItemLoading[item.id]?.deleting}
                          className="p-1 hover:bg-[#FEE2E2] rounded transition"
                          title="Delete"
                        >
                          {menuItemLoading[item.id]?.deleting ? (
                            "Deleting..."
                          ) : (
                            <Trash size={16} className="text-red-400" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-[#E6E2D8] overflow-hidden">
          {categoryLoading ? (
            <div className="py-12 text-center text-[#7A7A7A]">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center text-[#7A7A7A]">
              No categories. Click &quot;+ Add Category&quot;
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#F9FAFB] border-b border-[#E6E2D8]">
                <tr>
                  <th className="text-left py-3 px-4 text-sm text-[#7A7A7A]">
                    Name
                  </th>
                  <th className="text-right py-3 px-4 text-sm text-[#7A7A7A]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-[#F9F9F9] transition border-b border-[#E6E2D8]"
                  >
                    <td className="py-4 px-4 text-sm text-[#1A3C34]">
                      {cat.name}
                    </td>
                    <td className="py-4 px-4 flex justify-end gap-2">
                      <button className="p-1 hover:bg-[#E6E2D8] rounded transition">
                        <SquarePen size={16} />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        disabled={categoryItemLoading[cat.id]?.deleting}
                        className="p-1 hover:bg-[#FEE2E2] rounded transition"
                      >
                        {categoryItemLoading[cat.id]?.deleting ? (
                          "Deleting..."
                        ) : (
                          <Trash size={16} className="text-red-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modals */}
      <AddNewItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={refetchMenu}
      />

      {selectedItemId && (
        <EditItemModal
          isOpen={isEditModalOpen}
          item={menuItems.find((i) => i.id === selectedItemId)!}
          // categories={categories}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={refetchMenu}
        />
      )}

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onSuccess={refetchCategories}
      />
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { getAuthConfig } from "@/utils/auth";
// import Button from "@/app/(components)/commons/Button";
// import AddNewItemModal from "@/app/(components)/menu/AddMenuItemModal";
// import EditItemModal from "@/app/(components)/menu/EditMenuItemModal";
// import AddCategoryModal from "@/app/(components)/menu/AddCategoryModal";

// type MenuItem = {
//   id: number;
//   name: string;
//   category: string;
//   categoryId?: number;
//   price: string;
//   rawPrice?: number;
//   description: string;
//   image?: string;
//   availableForOrder: boolean;
// };

// type Category = {
//   id: number;
//   name: string;
// };

// export default function MenuItemsPage() {
//   const router = useRouter();

//   const [activeTab, setActiveTab] = useState<"menuItems" | "categories">(
//     "menuItems"
//   );
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
//   const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

//   // Fetch menu items
//   const fetchMenuItems = async () => {
//     try {
//       setIsLoading(true);
//       setError("");
//       const res = await axios.get(
//         "http://localhost:3001/admin/menu",
//         getAuthConfig()
//       );
//       const transformed = res.data.map((item: any) => ({
//         id: item.id,
//         name: item.name,
//         category: item.category?.name || "N/A",
//         categoryId: item.categoryId,
//         price: `${item.price}`,
//         rawPrice: item.price,
//         description: item.description || "",
//         image: item.imageUrl || undefined,
//         availableForOrder: item.isAvailable,
//       }));
//       setMenuItems(transformed);
//     } catch (err: any) {
//       console.error(err);
//       if (err.response?.status === 401) {
//         setError("Authentication failed. Redirecting to login...");
//         setTimeout(() => router.push("/auth"), 1500);
//       } else setError("Failed to fetch menu items");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       setIsLoading(true);
//       setError("");
//       const res = await axios.get(
//         "http://localhost:3001/admin/categories",
//         getAuthConfig()
//       );
//       setCategories(res.data);
//     } catch (err: any) {
//       console.error(err);
//       setError("Failed to fetch categories");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Fetch categories always to pass to modal
//     fetchCategories();

//     if (activeTab === "menuItems") fetchMenuItems();
//   }, [activeTab]);

//   const handleDeleteItem = async (id: number) => {
//     if (!confirm("Are you sure?")) return;
//     try {
//       await axios.delete(
//         `http://localhost:3001/admin/menuitem/${id}`,
//         getAuthConfig()
//       );
//       fetchMenuItems();
//     } catch {
//       alert("Failed to delete item");
//     }
//   };

//   const handleDeleteCategory = async (id: number) => {
//     if (!confirm("Are you sure?")) return;
//     try {
//       await axios.delete(
//         `http://localhost:3001/admin/deletecategory/${id}`,
//         getAuthConfig()
//       );
//       fetchCategories();
//     } catch {
//       alert("Failed to delete category");
//     }
//   };

//   const handleEditClick = (item: MenuItem) => {
//     setSelectedItem(item);
//     setIsEditModalOpen(true);
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-semibold text-[#1A3C34] mb-8">
//         Menu Management
//       </h1>

//       {error && (
//         <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">
//           {error}
//         </div>
//       )}

//       {isLoading && (
//         <div className="mb-4 text-center text-[#7A7A7A]">
//           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1A3C34] border-r-transparent"></div>
//           <p className="mt-2">Loading...</p>
//         </div>
//       )}

//       {/* Tabs */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex gap-6">
//           <button
//             onClick={() => setActiveTab("menuItems")}
//             className={`pb-2 border-b-2 text-sm font-medium transition ${
//               activeTab === "menuItems"
//                 ? "border-[#1A3C34] text-[#1A3C34]"
//                 : "border-transparent text-[#7A7A7A]"
//             }`}
//           >
//             Menu Items
//           </button>
//           <button
//             onClick={() => setActiveTab("categories")}
//             className={`pb-2 border-b-2 text-sm font-medium transition ${
//               activeTab === "categories"
//                 ? "border-[#1A3C34] text-[#1A3C34]"
//                 : "border-transparent text-[#7A7A7A]"
//             }`}
//           >
//             Categories
//           </button>
//         </div>

//         {activeTab === "menuItems" ? (
//           <Button
//             text="+ Add Item"
//             onClick={() => setIsAddModalOpen(true)}
//             width="w-auto"
//             height="h-[36px]"
//             className="px-6"
//           />
//         ) : (
//           <Button
//             text="+ Add Category"
//             onClick={() => setIsAddCategoryModalOpen(true)}
//             width="w-auto"
//             height="h-[36px]"
//             className="px-6"
//           />
//         )}
//       </div>

//       {/* Tables */}
//       {activeTab === "menuItems" ? (
//         <div className="rounded-lg border border-[#E6E2D8] overflow-hidden">
//           {menuItems.length === 0 ? (
//             <div className="py-12 text-center text-[#7A7A7A]">
//               No menu items. Click &quot;+ Add Item&quot;
//             </div>
//           ) : (
//             <table className="w-full">
//               <thead className="bg-[#F9FAFB] border-b border-[#E6E2D8]">
//                 <tr>
//                   <th className="text-left py-3 px-4 text-sm text-[#7A7A7A]">
//                     Name
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm text-[#7A7A7A]">
//                     Category
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm text-[#7A7A7A]">
//                     Price
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm text-[#7A7A7A]">
//                     Status
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm text-[#7A7A7A]">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {menuItems.map((item) => (
//                   <tr
//                     key={item.id}
//                     className="hover:bg-[#F9F9F9] transition border-b border-[#E6E2D8]"
//                   >
//                     <td className="py-4 px-4 text-sm text-[#1A3C34]">
//                       {item.name}
//                     </td>
//                     <td className="py-4 px-4 text-sm text-[#7A7A7A]">
//                       {item.category}
//                     </td>
//                     <td className="py-4 px-4 text-sm text-[#1A3C34]">
//                       {item.price}
//                     </td>
//                     <td className="py-4 px-4">
//                       <span
//                         className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
//                           item.availableForOrder
//                             ? "bg-[#D1FAE5] text-[#065F46]"
//                             : "bg-[#FEE2E2] text-[#DC2626]"
//                         }`}
//                       >
//                         {item.availableForOrder ? "Available" : "Unavailable"}
//                       </span>
//                     </td>
//                     <td className="py-4 px-4">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleEditClick(item)}
//                           className="p-1 hover:bg-[#E6E2D8] rounded transition"
//                           title="Edit"
//                         >
//                           ✏️
//                         </button>
//                         <button
//                           onClick={() => handleDeleteItem(item.id)}
//                           className="p-1 hover:bg-[#FEE2E2] rounded transition"
//                           title="Delete"
//                         >
//                           🗑️
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       ) : (
//         <div className="rounded-lg border border-[#E6E2D8] overflow-hidden">
//           {categories.length === 0 ? (
//             <div className="py-12 text-center text-[#7A7A7A]">
//               No categories. Click &quot;+ Add Category&quot;
//             </div>
//           ) : (
//             <table className="w-full">
//               <thead className="bg-[#F9FAFB] border-b border-[#E6E2D8]">
//                 <tr>
//                   <th className="text-left py-3 px-4 text-sm text-[#7A7A7A]">
//                     Name
//                   </th>
//                   <th className="text-right py-3 px-4 text-sm text-[#7A7A7A]">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {categories.map((cat) => (
//                   <tr
//                     key={cat.id}
//                     className="hover:bg-[#F9F9F9] transition border-b border-[#E6E2D8]"
//                   >
//                     <td className="py-4 px-4 text-sm text-[#1A3C34]">
//                       {cat.name}
//                     </td>
//                     <td className="py-4 px-4 flex justify-end gap-2">
//                       <button className="p-1 hover:bg-[#E6E2D8] rounded transition">
//                         ✏️
//                       </button>
//                       <button
//                         onClick={() => handleDeleteCategory(cat.id)}
//                         className="p-1 hover:bg-[#FEE2E2] rounded transition"
//                       >
//                         🗑️
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}

//       {/* Modals */}
//       <AddNewItemModal
//         isOpen={isAddModalOpen}
//         onClose={() => setIsAddModalOpen(false)}
//         onSuccess={fetchMenuItems}
//       />

//       {selectedItem && (
//         <EditItemModal
//           isOpen={isEditModalOpen}
//           item={selectedItem} // pass full item
//           categories={categories}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setSelectedItem(null);
//           }}
//           onSuccess={fetchMenuItems}
//         />
//       )}

//       <AddCategoryModal
//         isOpen={isAddCategoryModalOpen}
//         onClose={() => setIsAddCategoryModalOpen(false)}
//         onSuccess={fetchCategories}
//       />
//     </div>
//   );
// }
