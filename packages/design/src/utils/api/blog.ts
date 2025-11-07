import axios from "axios";

export async function NewBlog(name: string) {
  return await axios.post("/blog", { name });
}

export async function DeleteBlog(id: string) {
  return await axios.delete("/blog/" + id);
}

export async function CreateBlogPost(
  id: string,
  title: string,
  content: string,
  tags: string[],
  image: string | null,
  isDraft: boolean
) {
  return await axios.post("/blog/" + id + "/posts", {
    title,
    content,
    tags,
    image,
    isDraft,
  });
}

export async function EditBlogPost(
  id: string,
  postId: string,
  title: string,
  content: string,
  tags: string[],
  image: string | null,
  isDraft: boolean
) {
  return await axios.put("/blog/" + id + "/posts/" + postId, {
    title,
    content,
    tags,
    image,
    isDraft,
  });
}
