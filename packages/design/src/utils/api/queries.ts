import axios from "axios";
import { getToken } from "../../design/utils/user";
import { useQuery } from "@tanstack/react-query";
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
