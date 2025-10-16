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

export function SaveToDraft(id: string, data: any) {
  return axios.post("/portfolios/" + id + "/draft", data);
}

export function DeleteDraft(id: string) {
  return axios.delete("/portfolios/" + id + "/draft");
}
