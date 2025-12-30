// src/services/auth.service.ts
import api from "./api";

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/admin/login", { email, password });

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data.user;
};

export const register = async (
  name: string,
  email: string,
  address: string,
  password: string
) => {
  return api.post("/user/createuser", { name, email, address, password });
};

// -------------------------
// Add this
export const getUserFromToken = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// import api from "./api";
// import jwtDecode from "jwt-decode";

// export const login = async (email: string, password: string) => {
//   const { data } = await api.post("/admin/login", { email, password });

//   localStorage.setItem("token", data.token);
//   return data.user; // Optional: you can decode instead of storing user
// };

// // Get user info from token
// export const getUserFromToken = () => {
//   const token = localStorage.getItem("token");
//   if (!token) return null;

//   try {
//     // jwtDecode will extract the payload
//     const decoded: { id: string; name: string; email: string; role: string } =
//       jwtDecode(token);
//     return decoded;
//   } catch {
//     return null;
//   }
// };

// export const logout = () => {
//   localStorage.removeItem("token");
// };
