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
