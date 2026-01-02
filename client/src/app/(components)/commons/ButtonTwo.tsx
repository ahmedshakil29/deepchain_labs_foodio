import * as React from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "figma";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | "figma";
}

const ButtonTwo = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    // --- HARDCODED COLORS EXTRACTED FROM YOUR GLOBAL.CSS ---

    // Root Variables:
    // --primary: #1a3c34
    // --primary-foreground: oklch(0.985 0 0) -> approx #FBFBFB (White)
    // --secondary: #fef7ea
    // --secondary-foreground: oklch(0.205 0 0) -> approx #333333
    // --background: oklch(1 0 0) -> #FFFFFF
    // --foreground: #2d2d2d
    // --muted: oklch(0.97 0 0) -> #F7F7F7
    // --muted-foreground: #7a7a7a
    // --destructive: oklch(0.577 0.245 27.325) -> #CF4C4C
    // --border: #e6e2d8
    // --input: #e6e2d8
    // --ring: oklch(0.708 0 0) -> #B4B4B4
    // --card: #fbfaf8
    // --accent: oklch(0.97 0 0) -> #F7F7F7
    // --accent-foreground: oklch(0.205 0 0) -> #333333

    const variantStyles = {
      default: "bg-[#1a3c34] text-[#FBFBFB] hover:bg-[#143a31] rounded-full", // Using primary color
      destructive:
        "bg-[#CF4C4C] text-[#FFFFFF] hover:bg-[#b04040] focus-visible:ring-[#CF4C4C]/20 rounded-full", // Approximated destructive hover
      outline:
        "border border-[#1A3C34] bg-[#FFFFFF] text-[#1A3C34] hover:bg-[#F7F7F7] hover:text-[#333333] rounded-full", // background/foreground + accent
      secondary: "bg-[#fef7ea] text-[#333333] hover:bg-[#ebe0cc] rounded-full", // secondary + darker hover
      ghost: "hover:bg-[#F7F7F7] hover:text-[#333333] rounded-full", // accent + accent-foreground
      link: "text-[#1a3c34] underline-offset-4 hover:underline", // primary color
      // Your Figma specific styles (Hardcoded as requested)
      figma:
        "bg-[#1A3C34] text-[#FFFFFF] hover:bg-[#143a31] hover:opacity-90 rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px] rounded-tr-none",
    };

    const sizeStyles = {
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      sm: "h-8 rounded-full gap-1.5 px-3 has-[>svg]:px-2.5",
      lg: "h-11 rounded-2xl gap-[10px] px-6 py-[18px] text-[16px] has-[>svg]:px-4",
      icon: "size-9",
      "icon-sm": "size-8",
      "icon-lg": "size-10",
      figma: "w-[140px] h-[45px] p-3 gap-[6px] text-sm",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

ButtonTwo.displayName = "Button";

export { ButtonTwo };
// import * as React from "react";
// import { cn } from "@/utils/cn";

// // 1. Define the props interface manually (replaces VariantProps)
// export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?:
//     | "default"
//     | "destructive"
//     | "outline"
//     | "secondary"
//     | "ghost"
//     | "link"
//     | "figma";
//   size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | "figma";
//   // Removed 'asChild' since we aren't using Radix Slot
// }

// const ButtonTwo = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant = "default", size = "default", ...props }, ref) => {
//     // 2. Logic to select styles based on variant (Replaces CVA)
//     const variantStyles = {
//       default:
//         "bg-[#1a3c34] text-primary-foreground hover:bg-primary/90 rounded-full",
//       destructive:
//         "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 rounded-full",
//       outline:
//         "border bg-background text-primary border-primary shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-full",
//       secondary:
//         "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full",
//       ghost:
//         "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-full",
//       link: "text-primary underline-offset-4 hover:underline",
//       // Your Figma specific styles
//       figma:
//         "bg-[#1A3C34] text-white hover:bg-[#143a31] rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px] rounded-tr-none",
//     };

//     // 3. Logic to select styles based on size
//     const sizeStyles = {
//       default: "h-9 px-4 py-2 has-[>svg]:px-3",
//       sm: "h-8 rounded-full gap-1.5 px-3 has-[>svg]:px-2.5",
//       lg: "h-11 rounded-2xl gap-[10px] px-6 py-[18px] text-[16px] has-[>svg]:px-4",
//       icon: "size-9",
//       "icon-sm": "size-8",
//       "icon-lg": "size-10",
//       // Your Figma specific sizes
//       figma: "w-[140px] h-[45px] p-3 gap-[6px] text-sm",
//     };

//     return (
//       <button
//         ref={ref}
//         className={cn(
//           // Base classes (the long string from your original code)
//           "inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:cursor-pointer",
//           // Selected variant
//           variantStyles[variant],
//           // Selected size
//           sizeStyles[size],
//           // Custom classes passed in
//           className
//         )}
//         {...props}
//       />
//     );
//   }
// );

// ButtonTwo.displayName = "Button";

// export { ButtonTwo };
