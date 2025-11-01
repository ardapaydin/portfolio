import axios from "axios";

export async function NewBlog(name: string) {
  return await axios.post("/blog", { name });
}

export async function DeleteBlog(id: string) {
  return await axios.delete("/blog/" + id);
}
