"use client";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
import Header from "@/app/(components)/commons/Header";
import Button from "@/app/(components)/commons/Button";
// import ShowLoginModal from "@/app/(components)/commons/ShowLoginModal";
// import FoodItemCard from "@/app/(components)/FoodItemCard"; // Or your ItemCart
// import api from "@/services/api";
// import { useAuth } from "@/hooks/useAuth";
// import { ChefHat, UtensilsCrossed, Cake } from "lucide-react";
import MenuSection from "@/app/(components)/menu/MenuSection";

// type MenuItem = {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl: string;
// };

export default function HomePage() {
  // const { isAuthenticated } = useAuth();
  // const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // const categories = [
  //   { name: "Starters", icon: ChefHat },
  //   { name: "Main Courses", icon: UtensilsCrossed },
  //   { name: "Desserts", icon: Cake },
  // ];

  const handleOrderNow = () => {
    window.location.href = "/foodmenu";
  };

  const handleViewMenu = () => {
    window.location.href = "/foodmenu";
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full min-h-[650px] bg-gradient-to-br from-[#F8F6F1] to-[#FEF7EA] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 py-12 flex items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 max-w-[600px] z-10">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-full shadow-sm">
              <span className="w-2 h-2 bg-[#1A3C34] rounded-full animate-pulse"></span>
              <span className="text-[14px] font-medium text-[#1A3C34]">
                Food Ordering Service 🔑
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

      {/* Curated Categories */}
      <section className="max-w-[1400px] mx-auto px-8 py-20">
        {/* <div className="text-center mb-16">
          <h2
            className="text-[48px] font-bold text-[#1A1A1A] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Curated Categories
          </h2>
          <p className="text-[18px] text-[#666666]">
            Explore our diverse menu of culinary delights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.name}
                className="flex flex-col items-center justify-center p-8 bg-[#FEF7EA] rounded-3xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="w-16 h-16 bg-[#1A3C34] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent size={28} className="text-white" />
                </div>
                <h3 className="text-[20px] font-semibold text-[#1A1A1A]">
                  {category.name}
                </h3>
              </div>
            );
          })}
        </div> */}

        {/* Food Items Grid */}
        <MenuSection />
      </section>

      <div className="h-20"></div>
    </div>
  );
}

// "use client";

// import { ChefHat, UtensilsCrossed, Cake } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import Image from "next/image";
// //Internal IMPORT
// import { useAuth } from "@/hooks/useAuth";
// import Header from "@/app/(components)/commons/Header";
// import Button from "@/app/(components)/commons/Button";
// // import ItemCart from "@/components/ItemCart";

// import api from "@/services/api";

// type MenuItem = {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl: string;
// };

// export default function HomePage() {
//   const router = useRouter();
//   const { isAuthenticated } = useAuth();

//   // Fetch menu items using React Query
//   const { data: foodItems = [], isLoading } = useQuery<MenuItem[]>(
//     ["menuItems"],
//     async () => {
//       const res = await api.get("/user/menu"); // Axios instance
//       // Format backend data
//       return res.data.map((item: any) => ({
//         id: Number(item.id),
//         name: item.name,
//         description: item.description || "Delicious item from our menu",
//         price: parseFloat(item.price),
//         imageUrl: item.imageUrl
//           ? `http://localhost:3001${item.imageUrl}`
//           : "/images/golden_crunch_bite.png",
//       }));
//     }
//   );

//   const categories = [
//     { name: "Starters", icon: ChefHat },
//     { name: "Main Courses", icon: UtensilsCrossed },
//     { name: "Desserts", icon: Cake },
//   ];

//   const handleAddToOrder = (itemId: number, itemName: string) => {
//     if (!isAuthenticated) {
//       router.push("/auth");
//       return;
//     }
//     // TODO: Add to cart logic
//     console.log("Added to cart:", itemId, itemName);
//   };

//   const handleOrderNow = () => {
//     if (!isAuthenticated) {
//       router.push("/auth");
//       return;
//     }
//     router.push("/customer/FoodMenu"); // or order page
//   };

//   const handleViewMenu = () => {
//     router.push("/customer/FoodMenu");
//   };

//   return (
//     <div className="min-h-screen bg-[#FAFAF8]">
//       {/* Header */}
//       <Header />

//       {/* Hero Section */}
//       <section className="relative w-full min-h-[650px] bg-gradient-to-br from-[#F8F6F1] to-[#FEF7EA] overflow-hidden">
//         <div className="max-w-[1400px] mx-auto px-8 py-12 flex items-center justify-between gap-12">
//           {/* Left Content */}
//           <div className="flex-1 max-w-[600px] z-10">
//             <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-full shadow-sm">
//               <span className="w-2 h-2 bg-[#1A3C34] rounded-full animate-pulse"></span>
//               <span className="text-[14px] font-medium text-[#1A3C34]">
//                 Food Ordering Service 🔑
//               </span>
//             </div>

//             <h1
//               className="text-[72px] font-bold leading-[1.1] mb-6 text-[#1A1A1A]"
//               style={{ fontFamily: "Playfair Display, serif" }}
//             >
//               Where Great Food
//               <br />
//               Meets Great Taste.
//             </h1>

//             <p className="text-[18px] leading-[28px] text-[#666666] mb-8 max-w-[500px]">
//               Experience a symphony of flavors crafted with passion. Premium
//               ingredients, exquisite recipes, delivered to your door.
//             </p>

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
//                 src="/assets/dashboard.png"
//                 alt="Delicious pasta dish"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Curated Categories */}
//       <section className="max-w-[1400px] mx-auto px-8 py-20">
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

//         {/* Food Items Grid */}
//         {isLoading ? (
//           <p>Loading menu...</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20 justify-items-center">
//         {foodItems.map((item) => (
//               <ItemCart
//                 key={item.id}
//                 imageSrc={item.imageUrl}
//                 imageAlt={item.name}
//                 itemName={item.name}
//                 description={item.description}
//                 price={item.price}
//                 onAddToOrder={() => handleAddToOrder(item.id, item.name)}
//               />
//             ))}
//         </div>
//         )}
//       </section>

//       <div className="h-20"></div>
//     </div>
//   );
// }
