import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function getSubdomain(subdomain: string) {
  return useQuery({
    queryKey: ["subdomain", subdomain],
    queryFn: async () => {
      const res = await axios.get("/portfolios/view/" + subdomain);
      return res.data;
    },
  });
}
