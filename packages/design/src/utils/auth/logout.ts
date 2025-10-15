import { removeToken } from "../../design/utils/user";

export default function logout() {
  removeToken();
  window.location.href = "/auth/login";
}
