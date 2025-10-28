import axios from "axios";

export async function RegisterRequest() {
  return await axios.post("/user/passkey/register-request");
}

export async function RegisterResponse(attestationResponse: object) {
  return await axios.post("/user/passkey/register-response", {
    attestationResponse,
  });
}
