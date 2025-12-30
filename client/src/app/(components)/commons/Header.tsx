"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import Button from "./Button";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  const [activeLink, setActiveLink] = useState("Home");
  const router = useRouter();

  const links = [
    { name: "Home", route: "/" },
    { name: "Food Menus", route: "/FoodMenu" },
    { name: "My Orders", route: "/auth" },
  ];

  const handleNavigation = (name: string, route: string) => {
    setActiveLink(name);
    router.push(route);
  };

  return (
    <header
      className={twMerge(
        clsx(
          "w-full h-[64px] px-8 flex items-center justify-between bg-white border-b-2 border-[#E8E4DB]",
          className
        )
      )}
    >
      {/* Logo */}
      <div className="flex-shrink-0">
        <Logo />
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-0">
        {links.map((link) => (
          <button
            key={link.name}
            onClick={() => handleNavigation(link.name, link.route)}
            className={twMerge(
              clsx(
                "px-4 py-2 font-medium text-[14px] leading-[20px] transition-all duration-200 hover:text-[#1A3C34]",
                activeLink === link.name
                  ? "text-[#1A3C34] font-semibold"
                  : "text-[#666666]"
              )
            )}
          >
            {link.name}
          </button>
        ))}
      </div>

      {/* Sign In Button */}
      <div className="flex-shrink-0">
        <Button
          text="Sign in"
          icon={ArrowRight}
          iconPosition="right"
          iconSize={16}
          width="w-[100px]"
          height="h-[40px]"
          bgColor="#1A3C34"
          textColor="#FFFFFF"
          onClick={() => router.push("/auth")}
          className="font-semibold"
        />
      </div>
    </header>
  );
};

export default Header;
