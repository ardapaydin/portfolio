import axios from "axios";

export function createComment(id: string, content: string) {
  return axios.post("/portfolios/" + id + "/comments", { content });
}

export function deleteComment(id: string, commentId: string) {
  return axios.delete("/portfolios/" + id + "/comments/" + commentId);
}

export function updateComment(id: string, commentId: string, content: string) {
  return axios.put("/portfolios/" + id + "/comments/" + commentId, { content });
}
