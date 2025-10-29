import axios from "axios";

export async function RegisterRequest() {
  return await axios.post("/user/passkey/register-request");
}

export async function RegisterResponse(
  attestationResponse: object,
  name: string
) {
  return await axios.post("/user/passkey/register-response", {
    attestationResponse,
    name,
  });
}
