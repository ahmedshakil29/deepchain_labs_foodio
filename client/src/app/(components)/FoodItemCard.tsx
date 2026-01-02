"use client";

import Image from "next/image";
import Button from "@/app/(components)/commons/Button";
import { Plus } from "lucide-react";
import { FoodItemCardProps } from "@/app/foodmenu/page";
// import Image from "next/image";
export default function FoodItemCard({
  imageSrc,
  imageAlt,
  itemName,
  description,
  price,
  onAddToOrder,
  className,
}: FoodItemCardProps) {
  return (
    <div
      className={`relative w-[280px] h-[300px] bg-[#FEF7EA] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className || ""}`}
      style={{ borderTopRightRadius: "34px", borderBottomLeftRadius: "34px" }}
    >
      {/* Image */}
      <div
        className="absolute"
        style={{
          width: "222px",
          height: "222px",
          top: "-60px",
          left: "-50px",
          zIndex: 10,
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={209}
          height={206}
          className="object-contain rounded-full "
          sizes="222px"
        />
      </div>

      {/* Content */}
      <div className="absolute left-[56px] right-[20px] top-[150px]">
        <h3 className="font-semibold text-[18px] leading-[24px] text-[#1A1A1A] mb-1">
          {itemName}
        </h3>
        <p className="font-normal text-[13px] leading-[18px] text-[#666666] mb-3">
          {description}
        </p>
        <p className="font-bold text-[24px] leading-[32px] text-[#1A1A1A] mb-4">
          ৳{price.toFixed(2)}
        </p>
      </div>

      {/* Add to Order Button */}
      <div className="absolute bottom-5 left-3/4 transform -translate-x-1/2 translate-y-1/2">
        <Button
          text="Add to order"
          icon={Plus}
          iconPosition="right"
          iconSize={18}
          width="w-[140px]"
          height="h-[45px]"
          bgColor="#1A3C34"
          textColor="#FFFFFF"
          onClick={onAddToOrder}
          className="font-semibold"
        />
      </div>
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import Button from "@/app/(components)/commons/Button";
// import { Plus } from "lucide-react";
// import { FoodItemCardProps } from "@/app/foodmenu/page";

// export default function FoodItemCard({
//   imageSrc,
//   imageAlt,
//   itemName,
//   description,
//   price,
//   onAddToOrder,
//   className,
// }: FoodItemCardProps) {
//   return (
//     <div
//       className={`
//         relative
//         w-[280px]
//         h-[300px]
//         bg-[#FEF7EA]
//         shadow-lg
//         hover:shadow-xl
//         transition-all duration-300
//         hover:-translate-y-1
//         ${className || ""}
//       `}
//       style={{
//         borderTopRightRadius: "34px",
//         borderBottomLeftRadius: "34px",
//       }}
//     >
//       {/* Image Container - positioned absolutely with overflow */}
//       <div
//         className="absolute"
//         style={{
//           width: "222px",
//           height: "222px",
//           top: "-60px",
//           left: "-50px",
//           zIndex: 10,
//         }}
//       >
//         {/* <div className="relative w-full h-full object-cover">
//           <Image
//             src={imageSrc}
//             alt={imageAlt}
//             fill
//             className="object-cover"
//             style={{ borderRadius: '100px' }}
//             sizes="222px"
//           />
//         </div> */}
//         <img
//           src={imageSrc}
//           alt={imageAlt}
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Content Container */}
//       <div className="absolute left-[56px] right-[20px] top-[150px]">
//         {/* Item Name */}
//         <h3 className="font-semibold text-[18px] leading-[24px] text-[#1A1A1A] mb-1">
//           {itemName}
//         </h3>

//         {/* Description */}
//         <p className="font-normal text-[13px] leading-[18px] text-[#666666] mb-3">
//           {description}
//         </p>

//         {/* Price */}
//         <p className="font-bold text-[24px] leading-[32px] text-[#1A1A1A] mb-4">
//           ${price.toFixed(2)}
//         </p>
//       </div>

//       {/* Add to Order Button - positioned absolutely at bottom */}
//       <div
//         className="absolute"
//         style={{
//           bottom: "5px",
//           left: "75%",
//           transform: "translateX(-50%) translateY(50%)",
//         }}
//       >
//         <Button
//           text="Add to order"
//           icon={Plus}
//           iconPosition="right"
//           iconSize={18}
//           width="w-[140px]"
//           height="h-[45px]"
//           bgColor="#1A3C34"
//           textColor="#FFFFFF"
//           onClick={onAddToOrder}
//           className="font-semibold"
//         />
//       </div>
//     </div>
//   );
// }
