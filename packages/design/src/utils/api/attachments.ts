import { getToken } from "@/design/utils/user";
import axios from "axios";
const auth = getToken();
if (auth) axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

export async function UploadPicture(formData: FormData) {
  return await axios.post("/attachments", formData);
}

export async function UploadProfilePicture(formData: FormData) {
  return await axios.post("/attachments/avatar", formData);
}
