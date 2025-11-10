import axios from "axios";

export function like(id: string) {
  return axios.post("/portfolios/" + id + "/like");
}

export function deletelike(id: string) {
  return axios.delete("/portfolios/" + id + "/like");
}
