import axios from "axios";

export async function Verify(code: string) {
  return await axios.post("/user/2fa/verify", { code });
}

export async function Disable() {
  return await axios.post("/user/2fa/disable");
}

export async function newBackupCodes() {
  return await axios.post("/user/2fa/backup-codes");
}
