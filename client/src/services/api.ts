// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// src/services/api.ts

// import axios from "axios";
// import { getAuthConfig } from "@/utils/auth";

// const api = axios.create({
//   baseURL: "http://localhost:3001",
// });

// api.interceptors.request.use((config) => {
//   const authConfig = getAuthConfig();
//   config.headers = {
//     ...config.headers,
//     ...authConfig.headers,
//   };
//   return config;
// });

// export default api;
// ✔ Removes all manual token handling
// ✔ One place to change baseURL later

//88888888888
// import axios from "axios";
// import { getToken, clearToken } from "@/utils/token";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
//   withCredentials: false, // set true only if using cookies
// });

// /**
//  * Request interceptor → attach token
//  */
// api.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /**
//  * Response interceptor → global error handling
//  */
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       clearToken();
//       if (typeof window !== "undefined") {
//         window.location.href = "/auth";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
