"use client";

import { useRouter, usePathname } from "next/navigation";
import Logo from "@/app/(components)/commons/Logo";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/auth");
    }
  };

  const navItems = [
    {
      name: "Menu Items",
      icon: "☰",
      path: "/admin/MenuItems",
    },
    {
      name: "Orders",
      icon: "📦",
      path: "/admin/Orders",
    },
  ];

  return (
    <div className="w-[170px] bg-[#F5F5F0] border-r border-[#E6E2D8] flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          // Check if current path matches or if it's the base /admin path (default to MenuItems)
          const isActive =
            pathname === item.path ||
            (pathname === "/admin" && item.path === "/admin/MenuItems");

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg mb-1 text-sm font-medium transition ${
                isActive
                  ? "bg-[#1A3C34] text-white" // Selected: Green bg, white text
                  : "text-[#7A7A7A] hover:bg-[#1A3C34] hover:text-white" // Not selected: Gray text, hover to green
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Sign Out */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-6 py-4 text-sm font-medium text-[#DC2626] hover:bg-[#FEE2E2] transition"
      >
        <span className="text-base">↩</span>
        Sign Out
      </button>
    </div>
  );
}
