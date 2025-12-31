"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, ChevronDown } from "lucide-react";
import Logo from "../commons/Logo";

const CustomerHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (pathname === "/customer") return "home";
    if (pathname === "/customer/FoodMenu") return "food-menu";
    if (pathname === "/customer/orders") return "my-orders";
    return undefined; // / path বা অন্য কোনো path এখানে active হবে না
  };

  const activeTab = getActiveTab();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHomeClick = () => {
    router.push("/customer");
  };

  const handleFoodMenuClick = () => {
    router.push("/customer/FoodMenu");
  };

  const handleMyOrdersClick = () => {
    router.push("/customer/orders");
  };

  const handleViewDetails = () => {
    setIsDropdownOpen(false);
    router.push("/customer/profile");
  };

  // const handleViewOrders = () => {
  //   setIsDropdownOpen(false);
  //   router.push("/OrderDetails");
  // };

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    // Add your sign out logic here
    // console.log("Signing out...");

    router.push("/auth");
  };
  return (
    <nav className="w-full bg-white border-b border-[#E5E5E5]">
      <div className="max-w-[1440px] mx-auto px-8 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <button
            onClick={handleHomeClick}
            className={`text-[16px] font-medium transition-colors ${
              activeTab === "home"
                ? "text-[#1A3C34]"
                : "text-[#666666] hover:text-[#1A3C34]"
            }`}
          >
            Home
          </button>

          <button
            onClick={handleFoodMenuClick}
            className={`text-[16px] font-medium transition-colors ${
              activeTab === "food-menu"
                ? "text-[#1A3C34]"
                : "text-[#666666] hover:text-[#1A3C34]"
            }`}
          >
            Food Menu
          </button>

          <button
            onClick={handleMyOrdersClick}
            className={`px-6 py-2 rounded-full text-[16px] font-medium transition-all ${
              activeTab === "my-orders"
                ? "bg-[#1A3C34] text-white"
                : "bg-transparent text-[#666666] border border-[#E5E5E5] hover:border-[#1A3C34] hover:text-[#1A3C34]"
            }`}
          >
            My Orders
          </button>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-[40px] h-[40px] rounded-full bg-[#1A3C34] flex items-center justify-center hover:brightness-110 transition-all"
          >
            <User size={20} className="text-white" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-[200px] bg-white rounded-lg shadow-lg border border-[#E5E5E5] py-2 z-50">
              <button
                onClick={handleViewDetails}
                className="w-full px-4 py-3 text-left text-[14px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
              >
                Profile
              </button>
              {/* <button
                onClick={handleViewOrders}
                className="w-full px-4 py-3 text-left text-[14px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
              >
                My Orders
              </button> */}
              <div className="border-t border-[#E5E5E5] my-1" />
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-3 text-left text-[14px] text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CustomerHeader;
