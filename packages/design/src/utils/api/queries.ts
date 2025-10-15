import axios from "axios";
import { getToken } from "../../design/utils/user";
import { useQuery } from "@tanstack/react-query";
import type { TypeUser } from "../../design/types/user";

const auth = getToken();
if (auth) axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

export function useVerfyEmail(token: string) {
  return useQuery({
    queryKey: ["verify-email", token],
    queryFn: async () => {
      const res = await axios.post("/auth/verify-email", { token });
      return res.data;
    },
    enabled: !!token,
    retry: false,
  });
}

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get("/auth/me");
      return res.data as { user?: TypeUser };
    },
    retry: false,
  });
}

export function useTemplate(template: string) {
  return useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const res = await axios.get("/templates/" + template);
      return res.data?.data?.default;
    },
  });
}
