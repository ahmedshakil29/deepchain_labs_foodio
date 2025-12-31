"use client";

import { useState, useEffect } from "react";
import FoodItemCard from "@/app/(components)/FoodItemCard";
import ShowLoginModal from "@/app/(components)/commons/ShowLoginModal";
import axios from "axios";
import { toast } from "react-hot-toast";
import Header from "@/app/(components)/commons/Header";

type MenuItem = {
  id: number;
  imageSrc: string;
  imageAlt: string;
  itemName: string;
  description: string;
  price: number;
  category: "all" | "starters" | "main" | "desserts";
};

type CategoryType = "all" | "starters" | "main" | "desserts";

type SelectedMenuItem = {
  menuItemId: number;
  name: string;
  price: number;
};

type OrderData = {
  menuItemId: number;
  quantity: number;
};

export default function FoodMenu() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedMenuItem | null>(
    null
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const categories: { label: string; value: CategoryType }[] = [
    { label: "All", value: "all" },
    { label: "Starters", value: "starters" },
    { label: "Main Courses", value: "main" },
    { label: "Desserts", value: "desserts" },
  ];

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const url =
          activeCategory === "all"
            ? "http://localhost:3001/user/menu"
            : `http://localhost:3001/user/menu?category=${activeCategory}`;
        const response = await axios.get(url);

        const formattedItems: MenuItem[] = response.data.map((item: any) => ({
          id: item.id,
          imageSrc: item.imageUrl
            ? `${item.imageUrl}?w=400&h=400&c=fill&q=80`
            : "/assets/dashboard.png",
          imageAlt: item.name,
          itemName: item.name,
          description: item.description,
          price: parseFloat(item.price),
          category: item.category?.name?.toLowerCase() as CategoryType,
        }));

        setMenuItems(formattedItems);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        toast.error("Failed to load menu items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [activeCategory]);

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  // Add to Order handler
  const handleAddToOrder = (item: MenuItem) => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Open login modal if not logged in
      setIsLoginModalOpen(true);
      return;
    }

    // Logged in => open order modal
    setSelectedItem({
      menuItemId: item.id,
      name: item.itemName,
      price: item.price,
    });
    setIsOrderModalOpen(true);
  };

  // Confirm order
  //   const handleConfirmOrder = async (orderData: OrderData) => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       if (!token) return;

  //       await axios.post("http://localhost:3001/user/placeorder", orderData, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       toast.success(`${selectedItem?.name || "Item"} added successfully!`, {
  //         duration: 3000,
  //         position: "top-right",
  //       });
  //     } catch (error: any) {
  //       console.error("Order error:", error);
  //       if (axios.isAxiosError(error)) {
  //         if (error.response?.status === 401) {
  //           toast.error("Session expired. Please login again.");
  //           window.location.href = "/auth";
  //         } else {
  //           toast.error(
  //             `Failed to place order: ${error.response?.data?.message || "Unknown error"}`
  //           );
  //         }
  //       } else {
  //         toast.error("Failed to place order. Please try again.");
  //       }
  //     } finally {
  //       setIsOrderModalOpen(false);
  //       setSelectedItem(null);
  //     }
  //   };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl py-16 mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl mb-4 text-[#1A1A1A]">Our Menu</h1>
          <p className="text-[#666666] text-lg">
            Discover our selection of premium dishes, crafted with passion.
          </p>
        </div>

        {/* Categories */}
        <div className="flex justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                activeCategory === cat.value
                  ? "bg-[#1A3C34] text-white"
                  : "bg-white text-[#1A3C34] border border-[#E5E5E5] hover:border-[#1A3C34]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1A3C34] border-r-transparent"></div>
            <p className="text-[#666666] mt-4">Loading menu items...</p>
          </div>
        )}
        {/* Menu Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24 mt-20">
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-[#666666] text-lg">
                  No items found in this category.
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="flex justify-center">
                  <FoodItemCard
                    imageSrc={item.imageSrc}
                    imageAlt={item.imageAlt}
                    itemName={item.itemName}
                    description={item.description}
                    price={item.price}
                    onAddToOrder={() => handleAddToOrder(item)}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedItem && (
        <ShowLoginModal
          isOpen={isOrderModalOpen}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedItem(null);
          }}
        />
      )}

      <ShowLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

// FoodItemCard props
export type FoodItemCardProps = {
  imageSrc: string;
  imageAlt: string;
  itemName: string;
  description: string;
  price: number;
  onAddToOrder?: () => void;
  className?: string;
};

//---------------------------
// "use client";

// import { useState, useEffect } from "react";
// import OrderConfirmModal from "@/app/(components)/orders/OrderConfirmModal";
// import FoodItemCard from "@/app/(components)/FoodItemCard";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// type MenuItem = {
//   id: number;
//   imageSrc: string;
//   imageAlt: string;
//   itemName: string;
//   description: string;
//   price: number;
//   category: "all" | "starters" | "main" | "desserts";
// };

// type CategoryType = "all" | "starters" | "main" | "desserts";

// type SelectedMenuItem = {
//   menuItemId: number;
//   name: string;
//   price: number;
// };

// type OrderData = {
//   menuItemId: number;
//   quantity: number;
// };

// export default function FoodMenu() {
//   const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<SelectedMenuItem | null>(
//     null
//   );

//   // Category buttons
//   const categories: { label: string; value: CategoryType }[] = [
//     { label: "All", value: "all" },
//     { label: "Starters", value: "starters" },
//     { label: "Main Courses", value: "main" },
//     { label: "Desserts", value: "desserts" },
//   ];

//   // Fetch menu items
//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       setLoading(true);
//       try {
//         const url =
//           activeCategory === "all"
//             ? "http://localhost:3001/user/menu"
//             : `http://localhost:3001/user/menu?category=${activeCategory}`;

//         const response = await axios.get(url);

//         const formattedItems: MenuItem[] = response.data.map((item: any) => ({
//           id: item.id,
//           imageSrc: item.imageUrl
//             ? `${item.imageUrl}?w=400&h=400&c=fill&q=80` // Cloudinary optimization
//             : "/assets/dashboard.png",
//           imageAlt: item.name,
//           itemName: item.name,
//           description: item.description,
//           price: parseFloat(item.price),
//           category: item.category?.name?.toLowerCase() as CategoryType,
//         }));

//         setMenuItems(formattedItems);
//       } catch (error) {
//         console.error("Error fetching menu items:", error);
//         toast.error("Failed to load menu items. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMenuItems();
//   }, [activeCategory]);

//   const filteredItems =
//     activeCategory === "all"
//       ? menuItems
//       : menuItems.filter((item) => item.category === activeCategory);

//   // Open modal on "Add to Order"
//   const handleAddToOrder = (item: MenuItem) => {
//     setSelectedItem({
//       menuItemId: item.id,
//       name: item.itemName,
//       price: item.price,
//     });
//     setIsModalOpen(true);
//   };

//   // Confirm order
//   const handleConfirmOrder = async (orderData: OrderData) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please login to place an order");
//         window.location.href = "/auth";
//         return;
//       }

//       await axios.post("http://localhost:3001/user/placeorder", orderData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       toast.success(`${selectedItem?.name || "Item"} added successfully!`, {
//         duration: 3000,
//         position: "top-right",
//       });
//     } catch (error: any) {
//       console.error("Order error:", error);
//       if (axios.isAxiosError(error)) {
//         if (error.response?.status === 401) {
//           toast.error("Session expired. Please login again.");
//           window.location.href = "/auth";
//         } else {
//           toast.error(
//             `Failed to place order: ${
//               error.response?.data?.message || "Unknown error"
//             }`
//           );
//         }
//       } else {
//         toast.error("Failed to place order. Please try again.");
//       }
//     } finally {
//       setIsModalOpen(false);
//       setSelectedItem(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white py-16 px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="font-serif text-5xl mb-4 text-[#1A1A1A]">Our Menu</h1>
//           <p className="text-[#666666] text-lg">
//             Discover our selection of premium dishes, crafted with passion.
//           </p>
//         </div>

//         {/* Categories */}
//         <div className="flex justify-center gap-4 mb-16">
//           {categories.map((cat) => (
//             <button
//               key={cat.value}
//               onClick={() => setActiveCategory(cat.value)}
//               className={`
//                 px-6 py-2 rounded-full font-medium text-sm transition-all
//                 ${
//                   activeCategory === cat.value
//                     ? "bg-[#1A3C34] text-white"
//                     : "bg-white text-[#1A3C34] border border-[#E5E5E5] hover:border-[#1A3C34]"
//                 }
//               `}
//             >
//               {cat.label}
//             </button>
//           ))}
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="text-center py-20">
//             <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1A3C34] border-r-transparent"></div>
//             <p className="text-[#666666] mt-4">Loading menu items...</p>
//           </div>
//         )}

//         {/* Menu Grid */}
//         {!loading && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24 mt-20">
//             {filteredItems.length === 0 ? (
//               <div className="col-span-full text-center py-20">
//                 <p className="text-[#666666] text-lg">
//                   No items found in this category.
//                 </p>
//               </div>
//             ) : (
//               filteredItems.map((item) => (
//                 <div key={item.id} className="flex justify-center">
//                   <FoodItemCard
//                     imageSrc={item.imageSrc}
//                     imageAlt={item.imageAlt}
//                     itemName={item.itemName}
//                     description={item.description}
//                     price={item.price}
//                     onAddToOrder={() => handleAddToOrder(item)}
//                   />
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       {/* Order Modal */}
//       {selectedItem && (
//         <OrderConfirmModal
//           isOpen={isModalOpen}
//           onClose={() => {
//             setIsModalOpen(false);
//             setSelectedItem(null);
//           }}
//           menuItem={selectedItem}
//           onConfirm={handleConfirmOrder}
//         />
//       )}
//     </div>
//   );
// }

// // FoodItemCard props type
// export type FoodItemCardProps = {
//   imageSrc: string;
//   imageAlt: string;
//   itemName: string;
//   description: string;
//   price: number;
//   onAddToOrder?: () => void;
//   className?: string;
// };

//---------------------- 2nd --------------
// "use client";

// import { useState, useEffect } from "react";
// import OrderConfirmModal from "@/app/(components)/orders/OrderConfirmModal";
// import FoodItemCard from "@/app/(components)/FoodItemCard";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// type MenuItem = {
//   id: number;
//   imageSrc: string;
//   imageAlt: string;
//   itemName: string;
//   description: string;
//   price: number;
//   category: "all" | "starters" | "main" | "desserts";
// };

// type CategoryType = "all" | "starters" | "main" | "desserts";

// type SelectedMenuItem = {
//   menuItemId: number;
//   name: string;
//   price: number;
// };

// type OrderData = {
//   menuItemId: number;
//   quantity: number;
// };

// export default function FoodMenu() {
//   const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<SelectedMenuItem | null>(
//     null
//   );

//   // Categories array for buttons
//   const categories: { label: string; value: CategoryType }[] = [
//     { label: "All", value: "all" },
//     { label: "Starters", value: "starters" },
//     { label: "Main Courses", value: "main" },
//     { label: "Desserts", value: "desserts" },
//   ];

//   // Fetch menu items
//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       setLoading(true);
//       try {
//         const url =
//           activeCategory === "all"
//             ? "http://localhost:3001/user/menu"
//             : `http://localhost:3001/user/menu?category=${activeCategory}`;

//         const response = await axios.get(url);

//         const formattedItems: MenuItem[] = response.data.map((item: any) => ({
//           id: item.id,
//           imageSrc: item.imageUrl
//             ? `http://localhost:3001${item.imageUrl}`
//             : "/assets/dashboard.png",
//           imageAlt: item.name,
//           itemName: item.name,
//           description: item.description,
//           price: parseFloat(item.price),
//           category: item.category?.name?.toLowerCase() as CategoryType,
//         }));

//         setMenuItems(formattedItems);
//       } catch (error) {
//         console.error("Error fetching menu items:", error);
//         toast.error("Failed to load menu items. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMenuItems();
//   }, [activeCategory]);

//   // Filter items by category
//   const filteredItems =
//     activeCategory === "all"
//       ? menuItems
//       : menuItems.filter((item) => item.category === activeCategory);

//   // Open modal on "Add to Order"
//   const handleAddToOrder = (item: MenuItem) => {
//     setSelectedItem({
//       menuItemId: item.id,
//       name: item.itemName,
//       price: item.price,
//     });
//     setIsModalOpen(true);
//   };

//   // Confirm order
//   const handleConfirmOrder = async (orderData: OrderData) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please login to place an order");
//         window.location.href = "/auth";
//         return;
//       }

//       await axios.post("http://localhost:3001/user/placeorder", orderData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       toast.success(`${selectedItem?.name || "Item"} added successfully!`, {
//         duration: 3000,
//         position: "top-right",
//       });
//     } catch (error: any) {
//       console.error("Order error:", error);
//       if (axios.isAxiosError(error)) {
//         if (error.response?.status === 401) {
//           toast.error("Session expired. Please login again.");
//           window.location.href = "/auth";
//         } else {
//           toast.error(
//             `Failed to place order: ${
//               error.response?.data?.message || "Unknown error"
//             }`
//           );
//         }
//       } else {
//         toast.error("Failed to place order. Please try again.");
//       }
//     } finally {
//       setIsModalOpen(false);
//       setSelectedItem(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white py-16 px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="font-serif text-5xl mb-4 text-[#1A1A1A]">Our Menu</h1>
//           <p className="text-[#666666] text-lg">
//             Discover our selection of premium dishes, crafted with passion.
//           </p>
//         </div>

//         {/* Category Buttons */}
//         <div className="flex justify-center gap-4 mb-16">
//           {categories.map((cat) => (
//             <button
//               key={cat.value}
//               onClick={() => setActiveCategory(cat.value)}
//               className={`
//                 px-6 py-2 rounded-full font-medium text-sm transition-all
//                 ${
//                   activeCategory === cat.value
//                     ? "bg-[#1A3C34] text-white"
//                     : "bg-white text-[#1A3C34] border border-[#E5E5E5] hover:border-[#1A3C34]"
//                 }
//               `}
//             >
//               {cat.label}
//             </button>
//           ))}
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="text-center py-20">
//             <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1A3C34] border-r-transparent"></div>
//             <p className="text-[#666666] mt-4">Loading menu items...</p>
//           </div>
//         )}

//         {/* Menu Grid */}
//         {!loading && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24 mt-20">
//             {filteredItems.length === 0 ? (
//               <div className="col-span-full text-center py-20">
//                 <p className="text-[#666666] text-lg">
//                   No items found in this category.
//                 </p>
//               </div>
//             ) : (
//               filteredItems.map((item) => (
//                 <div key={item.id} className="flex justify-center">
//                   <FoodItemCard
//                     imageSrc={item.imageSrc}
//                     imageAlt={item.imageAlt}
//                     itemName={item.itemName}
//                     description={item.description}
//                     price={item.price}
//                     onAddToOrder={() => handleAddToOrder(item)}
//                   />
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       {/* Order Modal */}
//       {selectedItem && (
//         <OrderConfirmModal
//           isOpen={isModalOpen}
//           onClose={() => {
//             setIsModalOpen(false);
//             setSelectedItem(null);
//           }}
//           menuItem={selectedItem}
//           onConfirm={handleConfirmOrder}
//         />
//       )}
//     </div>
//   );
// }

// // FoodItemCard props type
// export type FoodItemCardProps = {
//   imageSrc: string;
//   imageAlt: string;
//   itemName: string;
//   description: string;
//   price: number;
//   onAddToOrder?: () => void;
//   className?: string;
// };
