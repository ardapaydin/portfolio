import { getToken } from "@/design/utils/user";
import axios from "axios";
const auth = getToken();
if (auth) axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

export async function UpdateUser(
  name: string,
  email: string,
  currentPassword: string,
  newPassword: string
) {
  return await axios.put("/user", {
    name,
    email,
    currentPassword: currentPassword || undefined,
    newPassword: newPassword || undefined,
  });
}
