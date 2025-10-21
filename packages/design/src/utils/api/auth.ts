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

export function LoginUser(email: string, password: string) {
  return axios.post("/auth/login", {
    email,
    password,
  });
}

export function RequestKey(email: string) {
  return axios.post("/auth/request-key", { email });
}
