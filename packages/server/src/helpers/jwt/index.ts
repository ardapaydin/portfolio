import { sign, verify } from "jsonwebtoken";

export const signToken = (userId: string) =>
  sign({ id: userId }, process.env.JWT_SECRET as string);
export const verifyToken = (token: string): { id: string } =>
  verify(token, process.env.JWT_SECRET as string) as { id: string };
