"use client";

import { LucideIcon } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  text: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  iconSize?: number;
  width?: string;
  height?: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
};

export default function Button({
  text,
  icon: Icon,
  iconPosition = "left",
  iconSize = 16,
  width = "w-[398px]",
  height = "h-[36px]",
  bgColor = "#1A3C34",
  textColor = "#FFFFFF",
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        clsx(
          "font-medium text-[14px] leading-[20px] tracking-[-0.15px] rounded-[56px] flex items-center justify-center relative hover:brightness-110 transition",
          width,
          height,
          className
        )
      )}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {Icon && (
        <Icon
          size={iconSize}
          className={clsx(
            "absolute top-1/2 -translate-y-1/2",
            iconPosition === "left" ? "left-[12px]" : "right-[12px]"
          )}
        />
      )}
      {text}
    </button>
  );
}
