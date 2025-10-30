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

export async function DeletePasskey(id: string) {
  return await axios.delete("/user/passkey/" + id);
}

export async function UpdatePasskey(id: string, name: string) {
  return await axios.put("/user/passkey/" + id, { name });
}
