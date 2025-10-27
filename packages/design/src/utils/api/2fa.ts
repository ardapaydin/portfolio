import axios from "axios";

export async function Verify(code: string) {
  return await axios.post("/user/2fa/verify", { code });
}
