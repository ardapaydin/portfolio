import type { TypeUser } from "./user";

export type TypeComment = {
  id: string;
  content: string;
  createdBy: TypeUser;
  createdAt: string;
  updatedAt: string;
};
