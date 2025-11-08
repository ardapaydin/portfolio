import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function GetUser(id?: string) {
  return useQuery({
    queryKey: ["discord", id, "lanyard"],
    queryFn: async () => {
      return await axios.get("https://api.lanyard.rest/v1/users/" + id, {
        headers: { Authorization: undefined },
      });
    },
    enabled: !!id,
  });
}
