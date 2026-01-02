"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import FoodItemCard from "@/app/(components)/FoodItemCard";
import ShowLoginModal from "@/app/(components)/commons/ShowLoginModal";
import { ChefHat, UtensilsCrossed, Cake } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  MenuItemApiResponseSchema,
  MenuItemApi,
  CategoryType as ZodCategoryType,
} from "@/schemas/menuItem.schema";
import FoodItemCardSkeleton from "@/app/(components)/skeleton/FoodItemCardSkeleton";

// ---------- CATEGORY SKELETON ----------
function CategorySkeleton() {
  return (
    <div
      className="w-[215px] h-[129px] bg-[#FEF7EA] animate-pulse"
      style={{
        borderTopLeftRadius: "20px",
        borderBottomRightRadius: "20px",
      }}
    />
  );
}

// ---------- MENU ITEM TYPE ----------
type MenuItem = {
  id: number;
  imageSrc: string;
  imageAlt: string;
  itemName: string;
  description: string;
  price: number;
  category?: ZodCategoryType;
};

// ---------- CATEGORY CONFIG ----------
const categories: {
  name: string;
  value: ZodCategoryType;
  icon: LucideIcon;
}[] = [
  { name: "Starters", value: "starters", icon: ChefHat },
  { name: "Main Course", value: "main course", icon: UtensilsCrossed },
  { name: "Desserts", value: "desserts", icon: Cake },
];

// ---------- CATEGORY NORMALIZER ----------
const normalizeCategory = (
  raw?: string | null
): ZodCategoryType | undefined => {
  if (!raw) return undefined;
  const normalized = raw.toLowerCase().replace(/\s+/g, "-");
  if (normalized === "starters") return "starters";
  if (normalized === "main course") return "main course";
  if (normalized === "desserts") return "desserts";
  return undefined;
};

// ---------- MENU SECTION ----------
export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<ZodCategoryType>(
    categories[0].value
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  // For login modal
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `http://localhost:3001/user/menu?category=${activeCategory}`
        );

        // Zod validation
        const parsed = MenuItemApiResponseSchema.safeParse(res.data);
        if (!parsed.success) {
          console.error(parsed.error);
          toast.error("Invalid menu data received");
          return;
        }

        const items: MenuItem[] = parsed.data.map((item: MenuItemApi) => ({
          id: item.id,
          imageSrc: item.imageUrl ?? "/assets/dashboard.png",
          imageAlt: item.name,
          itemName: item.name,
          description: item.description ?? "",
          price: Number(item.price),
          category: normalizeCategory(item.category?.name),
        }));

        setMenuItems(items);
      } catch (error) {
        toast.error("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [activeCategory]);

  return (
    <section className="max-w-7xl mx-auto py-16">
      {/* ---------- HEADER ---------- */}
      <div className="text-center mb-16">
        <h2 className="text-[48px] font-bold text-[#1A1A1A] mb-4">
          Curated Categories
        </h2>
        <p className="text-[18px] text-[#666666]">
          Explore our diverse menu of culinary delights.
        </p>
      </div>

      {/* ---------- CATEGORY CARDS ---------- */}
      <div className="flex justify-center mb-20">
        <div className="w-[679px] h-[129px] flex gap-[17px]">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))
            : categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.value;

                return (
                  <div
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`w-[215px] h-[129px] flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isActive ? "bg-[#FBFAF8] shadow-lg" : "bg-[#FEF7EA]"
                    }`}
                    style={{
                      borderTopLeftRadius: "20px",
                      borderBottomRightRadius: "20px",
                    }}
                  >
                    <div
                      className={`w-[48px] h-[48px] rounded-full flex items-center justify-center mb-2 ${
                        isActive ? "bg-white" : "bg-[#1A3C34]"
                      }`}
                    >
                      <Icon
                        size={22}
                        className={isActive ? "text-[#1A3C34]" : "text-white"}
                      />
                    </div>

                    <h3 className="text-[20px] font-semibold">{cat.name}</h3>
                  </div>
                );
              })}
        </div>
      </div>

      {/* ---------- MENU GRID ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <FoodItemCardSkeleton key={i} />
          ))
        ) : menuItems.length === 0 ? (
          <p className="col-span-full text-center text-[#666666]">
            No items found.
          </p>
        ) : (
          menuItems.map((item) => (
            <FoodItemCard
              key={item.id}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
              itemName={item.itemName}
              description={item.description}
              price={item.price}
              onAddToOrder={() => setShowLoginModal(true)}
            />
          ))
        )}
      </div>
      <ShowLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </section>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import FoodItemCard from "@/app/(components)/FoodItemCard";
// import { ChefHat, UtensilsCrossed, Cake } from "lucide-react";
// import FoodItemCardSkeleton from "@/app/(components)/skeleton/FoodItemCardSkeleton";

// type CategoryType = "all" | "starters" | "main" | "desserts";

// type MenuItem = {
//   id: number;
//   imageSrc: string;
//   imageAlt: string;
//   itemName: string;
//   description: string;
//   price: number;
//   category: CategoryType;
// };

// const categories = [
//   { name: "Starters", value: "starters", icon: ChefHat },
//   { name: "Main Courses", value: "Main Course", icon: UtensilsCrossed },
//   { name: "Desserts", value: "desserts", icon: Cake },
// ];

// export default function MenuSection() {
//   const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       setLoading(true);
//       try {
//         const url =
//           activeCategory === "all"
//             ? "http://localhost:3001/user/menu"
//             : `http://localhost:3001/user/menu?category=${activeCategory}`;

//         const res = await axios.get(url);

//         const items: MenuItem[] = res.data.map((item: any) => ({
//           id: item.id,
//           imageSrc: item.imageUrl
//             ? `${item.imageUrl}?w=400&h=400&c=fill&q=80`
//             : "/assets/dashboard.png",
//           imageAlt: item.name,
//           itemName: item.name,
//           description: item.description,
//           price: parseFloat(item.price),
//           category: item.category?.name?.toLowerCase(),
//         }));

//         setMenuItems(items);
//       } catch (error) {
//         toast.error("Failed to load menu items");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMenuItems();
//   }, [activeCategory]);

//   return (
//     <section className="max-w-7xl mx-auto py-16">
//       {/* Section Header */}
//       <div className="text-center mb-16">
//         <h2
//           className="text-[48px] font-bold text-[#1A1A1A] mb-4"
//           style={{ fontFamily: "Playfair Display, serif" }}
//         >
//           Curated Categories
//         </h2>
//         <p className="text-[18px] text-[#666666]">
//           Explore our diverse menu of culinary delights.
//         </p>
//       </div>

//       {/* Category Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
//         {/* All */}
//         <div
//           onClick={() => setActiveCategory("all")}
//           className={`flex flex-col items-center justify-center p-8 rounded-3xl cursor-pointer
//             transition-all
//             ${
//               activeCategory === "all"
//                 ? "bg-[#FBFAF8] text-black shadow-lg"
//                 : "bg-[#FEF7EA]"
//             }
//           `}
//         >
//           <h3 className="text-[20px] font-semibold">All Items</h3>
//         </div>

//         {categories.map((cat) => {
//           const Icon = cat.icon;
//           const isActive = activeCategory === cat.value;

//           return (
//             <div
//               key={cat.value}
//               onClick={() => setActiveCategory(cat.value as CategoryType)}
//               className={`flex flex-col items-center justify-center p-8 rounded-3xl cursor-pointer
//                 transition-all
//                 ${
//                   isActive
//                     ? "bg-[#FBFAF8] text-black shadow-lg"
//                     : "bg-[#FEF7EA]"
//                 }
//               `}
//             >
//               <div
//                 className={`w-16 h-16 rounded-full flex items-center justify-center mb-4
//                   ${isActive ? "bg-white" : "bg-[#1A3C34]"}
//                 `}
//               >
//                 <Icon
//                   size={28}
//                   className={isActive ? "text-[#1A3C34]" : "text-white"}
//                 />
//               </div>

//               <h3 className="text-[20px] font-semibold">{cat.name}</h3>
//             </div>
//           );
//         })}
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className="text-center py-16">
//           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1A3C34] border-r-transparent" />
//         </div>
//       )}

//       {/* Menu Grid */}
//       {!loading && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
//           {menuItems.length === 0 ? (
//             <p className="col-span-full text-center text-[#666666]">
//               No items found.
//             </p>
//           ) : (
//             menuItems.map((item) => (
//               <FoodItemCard
//                 key={item.id}
//                 imageSrc={item.imageSrc}
//                 imageAlt={item.imageAlt}
//                 itemName={item.itemName}
//                 description={item.description}
//                 price={item.price}
//               />
//             ))
//           )}
//         </div>
//       )}
//     </section>
//   );
// }

//2nd one
// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import FoodItemCard from "@/app/(components)/FoodItemCard";
// import { ChefHat, UtensilsCrossed, Cake } from "lucide-react";
// type CategoryType = "all" | "starters" | "main" | "desserts";

// type MenuItem = {
//   id: number;
//   imageSrc: string;
//   imageAlt: string;
//   itemName: string;
//   description: string;
//   price: number;
//   category: CategoryType;
// };

// interface MenuSectionProps {
//   category?: CategoryType; // optional
//   limit?: number; // optional (for home page)
//   title?: string;
//   subtitle?: string;
// }
// const categories = [
//   { name: "Starters", icon: ChefHat },
//   { name: "Main Courses", icon: UtensilsCrossed },
//   { name: "Desserts", icon: Cake },
// ];

// export default function MenuSection({
//   category = "all",
//   limit,
//   title = "Our Menu",
//   subtitle,
// }: MenuSectionProps) {
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       setLoading(true);
//       try {
//         const url =
//           category === "all"
//             ? "http://localhost:3001/user/menu"
//             : `http://localhost:3001/user/menu?category=${category}`;

//         const res = await axios.get(url);

//         let items: MenuItem[] = res.data.map((item: any) => ({
//           id: item.id,
//           imageSrc: item.imageUrl
//             ? `${item.imageUrl}?w=400&h=400&c=fill&q=80`
//             : "/assets/dashboard.png",
//           imageAlt: item.name,
//           itemName: item.name,
//           description: item.description,
//           price: parseFloat(item.price),
//           category: item.category?.name?.toLowerCase(),
//         }));

//         if (limit) items = items.slice(0, limit);

//         setMenuItems(items);
//       } catch (err) {
//         toast.error("Failed to load menu items");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMenuItems();
//   }, [category, limit]);

//   return (
//     <section className="max-w-7xl mx-auto py-16">
//       <div className="text-center mb-16">
//         <h2
//           className="text-[48px] font-bold text-[#1A1A1A] mb-4"
//           style={{ fontFamily: "Playfair Display, serif" }}
//         >
//           Curated Categories
//         </h2>
//         <p className="text-[18px] text-[#666666]">
//           Explore our diverse menu of culinary delights.
//         </p>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
//         {categories.map((category) => {
//           const IconComponent = category.icon;
//           return (
//             <div
//               key={category.name}
//               className="flex flex-col items-center justify-center p-8 bg-[#FEF7EA] rounded-3xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
//             >
//               <div className="w-16 h-16 bg-[#1A3C34] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
//                 <IconComponent size={28} className="text-white" />
//               </div>
//               <h3 className="text-[20px] font-semibold text-[#1A1A1A]">
//                 {category.name}
//               </h3>
//             </div>
//           );
//         })}
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className="text-center py-16">
//           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1A3C34] border-r-transparent" />
//         </div>
//       )}

//       {/* Menu Grid */}
//       {!loading && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
//           {menuItems.map((item) => (
//             <FoodItemCard
//               key={item.id}
//               imageSrc={item.imageSrc}
//               imageAlt={item.imageAlt}
//               itemName={item.itemName}
//               description={item.description}
//               price={item.price}
//             />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }
