import { getToken } from "@/design/utils/user";
import axios from "axios";
const auth = getToken();
if (auth) axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

export function NewPortfolio(name: string, template: string) {
  return axios.post("/portfolios", {
    template,
    name,
  });
}
