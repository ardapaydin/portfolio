type APIResponse<T> = T & { errors: { code: number; message: string }[] };

export default async function APIRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  body?: any,
  options?: RequestInit
): Promise<APIResponse<T>> {
  const response = await fetch(
    "https://api.cloudflare.com/client/v4/accounts/" +
      process.env.CLOUDFLARE_ACCOUNT_ID +
      "/" +
      endpoint,
    {
      method,
      ...options,
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + process.env.CLOUDFLARE_API_KEY,
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }
  );
  if (response.status == 204) return {} as APIResponse<T>;
  return await response.json();
}
