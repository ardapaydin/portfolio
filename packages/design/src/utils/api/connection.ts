import { getToken } from "@/design/utils/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const auth = getToken();
if (auth) axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

export async function GetService(service: string) {
  return await axios.get("/connections/" + service);
}

export function ServiceCallback(
  service: string,
  code: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["connections", service, "code", code],
    queryFn: async () => {
      const res = await axios.get(
        "/connections/" + service + "/callback?code=" + code
      );
      return res.data;
    },
    retry: false,
    enabled,
  });
}
