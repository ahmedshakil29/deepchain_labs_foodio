"use client";

import { useState } from "react";
import Button from "@/app/(components)/commons/Button";
import axios from "axios"; // Keep this if used for order placement
import { useRouter } from "next/navigation";

import OrderConfirmModal from "@/app/(components)/orders/OrderConfirmModal";
import FeaturedMenuSection from "@/app/(components)/menu/FeaturedMenuSection"; // Import the new component
import { toast } from "react-hot-toast";

// Types (Keep if needed for modal logic)
type OrderData = {
  menuItemId: number;
  quantity: number;
};

type SelectedMenuItem = {
  menuItemId: number;
  name: string;
  price: number;
};

const Page = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedMenuItem | null>(
    null
  );
  // Removed: foodItems, loading, categories (moved to component)
  // Removed: fetch useEffect (moved to component)

  // Handle "Add to Order" button click
  // Note: We keep this here because the State (Modal) lives in the Parent
  const handleAddToOrder = (
    itemId: number,
    itemName: string,
    price: number
  ) => {
    setSelectedItem({
      menuItemId: itemId,
      name: itemName,
      price: price,
    });
    setIsModalOpen(true);
  };

  // Handle confirm from OrderAmount modal - Place order
  const handleConfirmOrder = async (orderData: OrderData) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to place an order");
        window.location.href = "/auth";
        return;
      }

      const payload = {
        menuItemId: Number(orderData.menuItemId),
        quantity: Number(orderData.quantity),
      };

      // Place order API call
      const response = await axios.post(
        "http://localhost:3001/user/placeorder",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Order placed successfully!");
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (error: any) {
      console.error("❌ Error placing order:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert("Session expired. Please login again.");
          window.location.href = "/auth";
        } else {
          alert(
            `Failed to place order: ${error.response?.data?.message || "Unknown error"}`
          );
        }
      }
    }
  };

  const handleOrderNow = () => {
    router.push("/customer/FoodMenu");
  };

  const handleViewMenu = () => {
    router.push("/customer/FoodMenu");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Hero Section - Unchanged */}
      <section className="relative w-full min-h-162.5 bg-linear-to-br from-[#F8F6F1] to-[#FEF7EA] overflow-hidden">
        <div className="max-w-350 mx-auto px-8 py-12 flex items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 max-w-150 z-10">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-full shadow-sm">
              <span className="w-2 h-2 bg-[#1A3C34] rounded-full animate-pulse"></span>
              <span className="text-[14px] font-medium text-[#1A3C34]">
                Food Ordering Service
              </span>
            </div>

            <h1
              className="text-[72px] font-bold leading-[1.1] mb-6 text-[#1A1A1A]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Where Great Food
              <br />
              Meets Great Taste.
            </h1>

            <p className="text-[18px] leading-[28px] text-[#666666] mb-8 max-w-[500px]">
              Experience a symphony of flavors crafted with passion. Premium
              ingredients, exquisite recipes, delivered to your door.
            </p>

            <div className="flex items-center gap-4">
              <Button
                text="Order Now"
                iconPosition="right"
                width="w-[160px]"
                height="h-[52px]"
                bgColor="#1A3C34"
                textColor="#FFFFFF"
                onClick={handleOrderNow}
                className="font-semibold text-[16px]"
              />
              <Button
                text="View Menu"
                width="w-[160px]"
                height="h-[52px]"
                bgColor="transparent"
                textColor="#1A3C34"
                onClick={handleViewMenu}
                className="font-semibold text-[16px] border-2 border-[#1A3C34]"
              />
            </div>
          </div>

          {/* Right Image */}
          <div
            className="relative flex-shrink-0"
            style={{ width: "608px", height: "565px" }}
          >
            <div
              className="absolute bg-[#FEF7EA]"
              style={{
                width: "608px",
                height: "56px",
                borderBottomLeftRadius: "210px",
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            />
            <div
              className="absolute overflow-hidden"
              style={{
                width: "474px",
                height: "474px",
                borderRadius: "237px",
                top: "45px",
                left: "67px",
                zIndex: 2,
              }}
            >
              <img
                src="/assets/dashboard.png"
                alt="Delicious pasta dish"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      {/* --- REPLACED SECTION --- */}
      {/* Instead of the huge category/menu code, we just use this: */}
      <FeaturedMenuSection onAddToOrder={handleAddToOrder} />
      {/* ------------------------ */}

      {selectedItem && (
        <OrderConfirmModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
          menuItem={selectedItem}
          onConfirm={handleConfirmOrder}
        />
      )}

      {/* Footer Spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default Page;

// "use client";

// import { useState, useEffect } from "react";
// import Button from "@/app/(components)/commons/Button";
// import { ChefHat, UtensilsCrossed, Cake } from "lucide-react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// // import ShowLoginModal from "@/app/(components)/commons/ShowLoginModal";
// // import SuccessToast from "@/components/SuccessToster";
// // import OrderAmount from "@/app/(components)/orders/OrderConfirmModal";

// import OrderConfirmModal from "@/app/(components)/orders/OrderConfirmModal";
// import FoodItemCard from "@/app/(components)/FoodItemCard";
// import { toast } from "react-hot-toast";

// type MenuItem = {
//   id: number;
//   imageSrc: string;
//   imageAlt: string;
//   itemName: string;
//   description: string;
//   price: number;
//   imageUrl: string;
// };

// type OrderData = {
//   menuItemId: number;
//   quantity: number;
// };

// type SelectedMenuItem = {
//   menuItemId: number;
//   name: string;
//   price: number;
// };
// const Page = () => {
//   const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<SelectedMenuItem | null>(
//     null
//   );
//   const [showSuccessToast, setShowSuccessToast] = useState(false);
//   const [successItemName, setSuccessItemName] = useState("");

//   const router = useRouter();

//   // Categories
//   const categories = [
//     { name: "Starters", icon: ChefHat },
//     { name: "Main Courses", icon: UtensilsCrossed },
//     { name: "Desserts", icon: Cake },
//   ];

//   // Fetch menu items from API
//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("http://localhost:3001/user/menu");

//         console.log("📦 API Response:", response.data);

//         // Backend data ke frontend format এ convert করো
//         const formattedItems = response.data.map((item: any) => {
//           const fullImageUrl = item.imageUrl
//             ? `http://localhost:3001${item.imageUrl}`
//             : "/images/dashboard.png";

//           console.log(`Item ID: ${item.id}, Type: ${typeof item.id}`);

//           return {
//             id: parseInt(item.id), // ✅ Ensure it's a number
//             imageSrc: fullImageUrl,
//             imageAlt: item.name,
//             itemName: item.name,
//             description: item.description || "Delicious item from our menu",
//             price: parseFloat(item.price),
//             imageUrl: fullImageUrl,
//           };
//         });

//         console.log("✨ Formatted Items:", formattedItems);

//         setFoodItems(formattedItems.slice(0, 4));
//       } catch (error) {
//         console.error("❌ Error fetching menu items:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMenuItems();
//   }, []);

//   // Handle "Add to Order" button click
//   const handleAddToOrder = (
//     itemId: number,
//     itemName: string,
//     price: number
//   ) => {
//     console.log("🎯 Add to Order clicked:", { itemId, itemName, price });
//     console.log("Type of itemId:", typeof itemId);

//     setSelectedItem({
//       menuItemId: itemId, // Already a number
//       name: itemName,
//       price: price,
//     });
//     setIsModalOpen(true);
//   };

//   // Handle confirm from OrderAmount modal - Place order
//   const handleConfirmOrder = async (orderData: OrderData) => {
//     try {
//       console.log("📦 Order Data received:", orderData);
//       console.log("menuItemId type:", typeof orderData.menuItemId);
//       console.log("quantity type:", typeof orderData.quantity);

//       // Get token from localStorage
//       const token = localStorage.getItem("token");

//       if (!token) {
//         alert("Please login to place an order");
//         window.location.href = "/auth";
//         return;
//       }

//       // Ensure data types are correct
//       const payload = {
//         menuItemId: Number(orderData.menuItemId), // ✅ Explicit conversion
//         quantity: Number(orderData.quantity), // ✅ Explicit conversion
//       };

//       console.log("📤 Sending payload:", payload);
//       console.log("Payload types:", {
//         menuItemId: typeof payload.menuItemId,
//         quantity: typeof payload.quantity,
//       });

//       // Place order API call
//       const response = await axios.post(
//         "http://localhost:3001/user/placeorder",
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("✅ Order placed successfully:", response.data);

//       // Show success toast
//       setSuccessItemName(selectedItem?.name || "Item");
//       setShowSuccessToast(true);
//     } catch (error: any) {
//       console.error("❌ Error placing order:", error);

//       if (axios.isAxiosError(error)) {
//         console.error("Response data:", error.response?.data);
//         console.error("Response status:", error.response?.status);

//         if (error.response?.status === 401) {
//           alert("Session expired. Please login again.");
//           window.location.href = "/auth";
//         } else if (error.response?.status === 400) {
//           alert(
//             `Validation error: ${JSON.stringify(
//               error.response?.data?.message || error.response?.data
//             )}`
//           );
//         } else {
//           alert(
//             `Failed to place order: ${
//               error.response?.data?.message || "Unknown error"
//             }`
//           );
//         }
//       } else {
//         alert("Failed to place order. Please try again.");
//       }
//     }
//   };

//   const handleOrderNow = () => {
//     router.push("/customer/FoodMenu");
//   };

//   const handleViewMenu = () => {
//     router.push("/customer/FoodMenu");
//   };
//   return (
//     <div className="min-h-screen bg-[#FAFAF8]">
//       {/* Hero Section */}
//       <section className="relative w-full min-h-[650px] bg-gradient-to-br from-[#F8F6F1] to-[#FEF7EA] overflow-hidden">
//         <div className="max-w-[1400px] mx-auto px-8 py-12 flex items-center justify-between gap-12">
//           {/* Left Content */}
//           <div className="flex-1 max-w-[600px] z-10">
//             {/* Badge */}
//             <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-full shadow-sm">
//               <span className="w-2 h-2 bg-[#1A3C34] rounded-full animate-pulse"></span>
//               <span className="text-[14px] font-medium text-[#1A3C34]">
//                 Food Ordering Service
//               </span>
//             </div>

//             {/* Heading */}
//             <h1
//               className="text-[72px] font-bold leading-[1.1] mb-6 text-[#1A1A1A]"
//               style={{ fontFamily: "Playfair Display, serif" }}
//             >
//               Where Great Food
//               <br />
//               Meets Great Taste.
//             </h1>

//             {/* Description */}
//             <p className="text-[18px] leading-[28px] text-[#666666] mb-8 max-w-[500px]">
//               Experience a symphony of flavors crafted with passion. Premium
//               ingredients, exquisite recipes, delivered to your door.
//             </p>

//             {/* Action Buttons */}
//             <div className="flex items-center gap-4">
//               <Button
//                 text="Order Now"
//                 iconPosition="right"
//                 width="w-[160px]"
//                 height="h-[52px]"
//                 bgColor="#1A3C34"
//                 textColor="#FFFFFF"
//                 onClick={handleOrderNow}
//                 className="font-semibold text-[16px]"
//               />
//               <Button
//                 text="View Menu"
//                 width="w-[160px]"
//                 height="h-[52px]"
//                 bgColor="transparent"
//                 textColor="#1A3C34"
//                 onClick={handleViewMenu}
//                 className="font-semibold text-[16px] border-2 border-[#1A3C34]"
//               />
//             </div>
//           </div>

//           {/* Right Image */}
//           <div
//             className="relative flex-shrink-0"
//             style={{ width: "608px", height: "565px" }}
//           >
//             {/* Background Frame with bottom-left radius */}
//             <div
//               className="absolute bg-[#FEF7EA]"
//               style={{
//                 width: "608px",
//                 height: "56px",
//                 borderBottomLeftRadius: "210px",
//                 top: 0,
//                 left: 0,
//                 zIndex: 1,
//               }}
//             />

//             {/* Food Image - Circular with exact positioning */}
//             <div
//               className="absolute overflow-hidden"
//               style={{
//                 width: "474px",
//                 height: "474px",
//                 borderRadius: "237px",
//                 top: "45px",
//                 left: "67px",
//                 zIndex: 2,
//               }}
//             >
//               <img
//                 src="/images/dashboardnoodles.png"
//                 alt="Delicious pasta dish"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Curated Categories Section */}
//       <section className="max-w-[1400px] mx-auto px-8 py-20">
//         {/* Section Header */}
//         <div className="text-center mb-16">
//           <h2
//             className="text-[48px] font-bold text-[#1A1A1A] mb-4"
//             style={{ fontFamily: "Playfair Display, serif" }}
//           >
//             Curated Categories
//           </h2>
//           <p className="text-[18px] text-[#666666]">
//             Explore our diverse menu of culinary delights.
//           </p>
//         </div>

//         {/* Categories Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
//           {categories.map((category) => {
//             const IconComponent = category.icon;
//             return (
//               <div
//                 key={category.name}
//                 className="flex flex-col items-center justify-center p-8 bg-[#FEF7EA] rounded-3xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
//               >
//                 <div className="w-16 h-16 bg-[#1A3C34] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
//                   <IconComponent size={28} className="text-white" />
//                 </div>
//                 <h3 className="text-[20px] font-semibold text-[#1A1A1A]">
//                   {category.name}
//                 </h3>
//               </div>
//             );
//           })}
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="text-center py-12">
//             <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1A3C34] border-r-transparent"></div>
//             <p className="text-[#666666] mt-4">Loading items...</p>
//           </div>
//         )}

//         {/* Food Items Grid */}
//         {!loading && foodItems.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20 justify-items-center">
//             {foodItems.map((item) => (
//               <FoodItemCard
//                 key={item.id}
//                 imageSrc={item.imageUrl}
//                 imageAlt={item.itemName}
//                 itemName={item.itemName}
//                 description={item.description}
//                 price={item.price}
//                 onAddToOrder={() =>
//                   handleAddToOrder(item.id, item.itemName, item.price)
//                 }
//               />
//             ))}
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && foodItems.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-[#666666] text-lg">
//               No items available at the moment
//             </p>
//           </div>
//         )}
//       </section>

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

//       {/* <SuccessToast
//         isOpen={showSuccessToast}
//         onClose={() => setShowSuccessToast(false)}
//         itemName={successItemName}
//         autoClose={true}
//         autoCloseDelay={3000}
//       /> */}
//       {/* Footer Spacing */}
//       <div className="h-20"></div>
//     </div>
//   );
// };

// export default Page;
