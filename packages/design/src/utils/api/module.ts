import { getToken } from "@/design/utils/user";
import axios from "axios";
const auth = getToken();
if (auth) axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

export function UpdateModuleConfig(
  portfolioId: string,
  moduleId: number,
  config: any
) {
  return axios.post(
    "/portfolios/" + portfolioId + "/modules/" + moduleId,
    config
  );
}
