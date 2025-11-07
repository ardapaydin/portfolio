import { getToken } from "@/design/utils/user";
import axios from "axios";
const auth = getToken();
if (auth) axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

export function NewPortfolio(
  name: string,
  template: string,
  subdomain?: string
) {
  return axios.post("/portfolios", {
    template,
    name,
    subdomain: subdomain ? subdomain : undefined,
  });
}

export function SaveToDraft(id: string, data: any) {
  return axios.post("/portfolios/" + id + "/draft", data);
}

export function DeleteDraft(id: string) {
  return axios.delete("/portfolios/" + id + "/draft");
}

export function updatePortfolio(id: string, name: string, subdomain: string) {
  return axios.put("/portfolios/" + id, { name, subdomain });
}

export function save(id: string) {
  return axios.post("/portfolios/" + id + "/save");
}

export function publish(id: string) {
  return axios.post("/portfolios/" + id + "/publish");
}

export function deletePortfolio(
  id: string,
  code?: string,
  twoFactorType?: string
) {
  return axios.delete("/portfolios/" + id, {
    data: {
      code: code ? code : undefined,
      twoFactorType: twoFactorType ? twoFactorType : undefined,
    },
  });
}

export function setPortfolioBlog(id: string, blogId: string) {
  return axios.post("/portfolios/" + id + "/blog/" + blogId);
}

export function deletePortfolioBlog(id: string) {
  return axios.delete("/portfolios/" + id + "/blog");
}
