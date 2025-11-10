import axios from "axios";

export function createComment(id: string, content: string) {
  return axios.post("/portfolios/" + id + "/comments", { content });
}
