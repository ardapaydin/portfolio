import axios from "axios";

export function CreateUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  return axios.post("/auth/register", {
    email,
    password,
    firstName: !firstName ? undefined : firstName,
    lastName: !lastName ? undefined : lastName,
  });
}

export function LoginUser(
  email: string,
  password: string,
  twoFactorType?: string,
  code?: string
) {
  return axios.post("/auth/login", {
    email,
    password,
    twoFactorType: twoFactorType ? twoFactorType : undefined,
    code: code ? code : undefined,
  });
}

export function RequestKey(email: string) {
  return axios.post("/auth/request-key", { email });
}

export function ChangePassword(key: string, password: string) {
  return axios.post("/auth/reset-password", { key, password });
}

export function PasskeyLoginStart() {
  return axios.post("/auth/passkey/login/start");
}

export function PasskeyLoginFinish(attestationResponse: object) {
  return axios.post("/auth/passkey/login/finish", { attestationResponse });
}
