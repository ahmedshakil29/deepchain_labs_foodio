import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useMenuItems = () => {
  return useQuery(["menuItems"], async () => {
    const { data } = await api.get("/menu-items");
    return data;
  });
};
