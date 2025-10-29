import axios from "axios";

export async function FinishMFA(
  type: string,
  ticket: string,
  code?: string,
  data?: Record<string, any>
) {
  return await axios.post("/mfa/finish", { type, ticket, data, code });
}
