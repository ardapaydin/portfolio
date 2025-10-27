import axios from "axios";

export async function Verify(code: string) {
  return await axios.post("/user/2fa/verify", { code });
}

export async function Disable(code: string) {
  return await axios.post("/user/2fa/disable", { code });
}
