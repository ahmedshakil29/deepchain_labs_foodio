import { User } from "@/types/user";

// Get token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") return localStorage.getItem("token");
  return null;
};

// Get user info from localStorage
export const getUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
  }
  return null;
};

// Get user role
export const getUserRole = (): string | null => {
  const user = getUser();
  return user?.role || null;
};

// Check if user is admin
export const isAdmin = (): boolean => getUserRole()?.toLowerCase() === "admin";

// Check if authenticated
export const isAuthenticated = (): boolean => !!getAuthToken();

// Logout user
export const logout = (redirectPath: string = "/auth"): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = redirectPath;
  }
};

// Axios auth config
export const getAuthConfig = () => {
  const token = getAuthToken();
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Redirect based on role
export const redirectByRole = (): string => {
  const role = getUserRole();
  if (role?.toLowerCase() === "admin") return "/admin/MenuItems";
  return "/auth";
};

// Require admin for protected routes
export const requireAdmin = (redirectPath: string = "/auth"): boolean => {
  if (!isAuthenticated()) {
    if (typeof window !== "undefined") window.location.href = redirectPath;
    return false;
  }
  if (!isAdmin()) {
    if (typeof window !== "undefined")
      window.location.href = "/customer/dashboard";
    return false;
  }
  return true;
};
