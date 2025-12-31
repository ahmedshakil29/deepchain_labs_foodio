"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ChefHat, UtensilsCrossed, Cake } from "lucide-react";
import FoodItemCard from "@/app/(components)/FoodItemCard";

type MenuItem = {
  id: number;
  imageSrc: string;
  imageAlt: string;
  itemName: string;
  description: string;
  price: number;
  imageUrl: string;
};

type Props = {
  onAddToOrder: (itemId: number, itemName: string, price: number) => void;
};

export default function FeaturedMenuSection({ onAddToOrder }: Props) {
  const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "Starters", icon: ChefHat },
    { name: "Main Courses", icon: UtensilsCrossed },
    { name: "Desserts", icon: Cake },
  ];

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/user/menu");

        const formattedItems = response.data.map((item: any) => {
          // 🔴 UPDATED LOGIC:
          // If Cloudinary URL exists, use it directly.
          // Otherwise, use the fallback placeholder.
          const imageUrl = item.imageUrl || "/assets/dashboard.png";

          return {
            id: parseInt(item.id),
            imageSrc: imageUrl, // Already a full URL
            imageAlt: item.name,
            itemName: item.name,
            description: item.description || "Delicious item from our menu",
            price: parseFloat(item.price),
            imageUrl: imageUrl, // Already a full URL
          };
        });

        setFoodItems(formattedItems.slice(0, 4));
      } catch (error) {
        console.error("❌ Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-8 py-20">
      {/* Section Header */}
      <div className="text-center mb-16">
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

      {/* Categories Grid */}
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
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1A3C34] border-r-transparent"></div>
          <p className="text-[#666666] mt-4">Loading items...</p>
        </div>
      )}

      {/* Food Items Grid */}
      {!loading && foodItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20 justify-items-center">
          {foodItems.map((item) => (
            <FoodItemCard
              key={item.id}
              imageSrc={item.imageUrl} // Pass the full Cloudinary URL
              imageAlt={item.itemName}
              itemName={item.itemName}
              description={item.description}
              price={item.price}
              onAddToOrder={() =>
                onAddToOrder(item.id, item.itemName, item.price)
              }
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && foodItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#666666] text-lg">
            No items available at the moment
          </p>
        </div>
      )}
    </section>
  );
}
