// Directly paste this where you need the button
// OR save as a component like 'FigmaButton.tsx'

import { Plus } from "lucide-react";

export default function FigmaButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        inline-flex 
        items-center 
        justify-center 
        gap-[6px]          /* gap: 6px */
        w-[140px]          /* width: 140px */
        h-[45px]           /* height: 45px */
        p-3                /* padding: 12px (Tailwind p-3 = 12px) */
        bg-[#1A3C34]       /* Assuming dark green based on previous context, or use your specific color code */
        text-white 
        font-semibold 
        text-sm            /* Standard font size for 45px height */
        opacity-100        
        hover:opacity-90   /* Optional: for interaction */
        active:scale-95    /* Optional: tactile feedback */
        transition-all
        cursor-pointer
        border-0
        outline-none
        rounded-tl-[20px]  /* border-top-left-radius: 20px */
        rounded-br-[20px]  /* border-bottom-right-radius: 20px */
        rounded-bl-[20px]  /* border-bottom-left-radius: 20px */
        rounded-tr-none    /* Explicitly setting top-right to 0 to match angle: 0 deg / square */
      "
    >
      <span>Add to order</span>
      <Plus size={18} /> {/* Icon size approx 18px for 45px height button */}
    </button>
  );
}
