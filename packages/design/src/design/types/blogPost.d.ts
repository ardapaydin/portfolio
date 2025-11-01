import type { TypeUser } from "./user";

export type TypeBlogPost = {
  id: string;
  title: string;
  content: string;
  isDraft: boolean;
  createdBy: TypeUser;
  createdAt: string;
  updatedAt: string;
};
