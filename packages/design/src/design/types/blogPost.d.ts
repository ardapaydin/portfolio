import type { TypeUser } from "./user";

export type TypeBlogPost = {
  id: string;
  title: string;
  content: string;
  isDraft: boolean;
  tags: string[];
  image: string;
  createdBy: TypeUser;
  createdAt: string;
  updatedAt: string;
};
